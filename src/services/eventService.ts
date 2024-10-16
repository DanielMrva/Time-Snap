const https = require("https");
import { AppDataSource } from "../config/database";
import { Event, Quiz, QuizEvent } from "../entities";

const MAX_REQUESTS = 10;

// Shuffle array function
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// const fetchEventsByDate = async (date: Date): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     const month = date.getMonth();
//     const day = date.getDate();

//     const url = `https://history.muffinlabs.com/date/${month}/${day}`;

//     https
//       .get(url, (response: any) => {
//         let data = "";

//         response.on("data", (chunk: any) => {
//           data += chunk;
//         });


//         response.on("end", () => {
//           try {
//             const jsonData = JSON.parse(data);
//             resolve(jsonData.data.Events);
//           } catch (error) {
//             reject(new Error(`Error parsing JSON data`));
//           }
//         });
//       })
//       .on("error", (error: any) => {
//         reject(error);
//       });
//   });
// };

const fetchEventsByDate = async (date: Date): Promise<any> => {
  return new Promise((resolve, reject) => {
    const month = date.toLocaleString("default", { month: "numeric" });
    const day = date.getDate();

    const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/${month}/${day}`;

    https
      .get(url, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const jsonData = JSON.parse(data);
            const events = jsonData.selected.map((item: any) => {
              return {
                year: item.year,
                description: item.text,
                // Extract the first page link and image if available
                links: item.pages.map((page: any) => ({
                  title: page.title,
                  link: page.content_urls.desktop.page
                })),
                image_url: item.pages[0]?.thumbnail?.source || null, // Optional image
              };
            });
            resolve(events);
          } catch (error) {
            console.error("Error parsing JSON data:", data);
            reject(new Error(`Error parsing JSON data`));
          }
        });
      })
      .on("error", (error: any) => {
        reject(error);
      });
  });
};

const selectEventsWithKeystones = (events: any[], numOfEvents: number) => {
  const firstEventYear = parseInt(events[0].year, 10);
  const endEventYear = parseInt(events[events.length - 1].year, 10);
  const totalSpan = endEventYear - firstEventYear;
  const interval = Math.round(totalSpan / (numOfEvents - 1));

  let keystones = [];
  let lastEventYear = null;

  // Select keystone events
  for (let i = 0; i < Math.floor(numOfEvents / 3); i++) {
    for (let j = 0; j < events.length; j++) {
      let currentYear = parseInt(events[j].year, 10);

      // Select the first valid event (earliest or one spaced by the interval)
      if (lastEventYear === null || currentYear - lastEventYear >= interval) {
        lastEventYear = currentYear; // Only set this after selecting the event
        keystones.push(events[j]);
        events.splice(j, 1); // Remove the selected event from the list
        j--; // Adjust the index since we removed an event
        break; // Move on to selecting the next keystone event
      }
    }
  }

  // Randomly select remaining events to fill up to numOfEvents
  const remainingEvents = [];
  const remainingSlots = numOfEvents - keystones.length;

  for (let i = 0; i < remainingSlots; i++) {
    // Randomly select from the remaining events
    const randomIndex = Math.floor(Math.random() * events.length);
    remainingEvents.push(events[randomIndex]);
    events.splice(randomIndex, 1); // Remove the selected event
  }

  // Combine keystones and remaining events
  const selectedEvents = [...keystones, ...remainingEvents];

  selectedEvents.sort(
    (a: { year: string }, b: { year: string }) =>
      parseInt(a.year, 10) - parseInt(b.year, 10)
  );

  return selectedEvents;
};


export const fetchAndStoreEvents = async (quantity = 5) => {
  try {
    const quizRepository = AppDataSource.getRepository(Quiz);
    const eventRepository = AppDataSource.getRepository(Event);
    const quizEventRepository = AppDataSource.getRepository(QuizEvent);

    quantity = Math.min(quantity || 1, MAX_REQUESTS);

    const handleQuizCreation = async (date: Date) => {
      const existingQuiz = await quizRepository.findOne({
        where: { quiz_date: date },
      });

      if (existingQuiz) {
        console.log(
          `Quiz for ${date.toLocaleDateString()} already exists. Skipping`
        );
        return;
      }

      const events = await fetchEventsByDate(date);

      if (!events || events.length === 0) {
        console.log(`No events fetched for ${date.toLocaleDateString()}.`);
        return;
      }

      // Sort events chronologically based on year
      events.sort(
        (a: { year: string }, b: { year: string }) =>
          parseInt(a.year, 10) - parseInt(b.year, 10)
      );

      const selectedEvents = selectEventsWithKeystones(events, 10);

      const quiz = new Quiz();
      quiz.quiz_date = date;
      await quizRepository.save(quiz);

      // Save selected events to the database (similar to your current logic)
      let order = 1;

      const availablePresentationOrders = Array.from({ length: selectedEvents.length }, (_, i) => i + 1);

      // Step 2: Function to randomly select and return a presentation order from the available ones
      const getRandomPresentationOrder = () => {
        // Randomly select an index from availablePresentationOrders
        const randomIndex = Math.floor(Math.random() * availablePresentationOrders.length);
      
        // Remove and return the random order from the array
        return availablePresentationOrders.splice(randomIndex, 1)[0];
      };

      for (const item of selectedEvents) {
        const event = new Event();
        event.type = "Event";
        event.year = parseInt(item.year, 10);
        event.description = item.description || "No description available"; 
        event.date = `${date.toLocaleString("default", { month: "long" })}_${date.getDate()}`;
        event.source_url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/selected/${date.getMonth() + 1}/${date.getDay()}`;
        event.links = item.links;      
        event.image_url = item.image_url;

        await eventRepository.save(event);

        const quizEvent = new QuizEvent();
        quizEvent.quiz = quiz;
        quizEvent.event = event;
        quizEvent.order = order++;
        quizEvent.randomizedOrder = getRandomPresentationOrder();
        await quizEventRepository.save(quizEvent);
      }

      console.log(`Quiz for ${date.toDateString()} generated successfully.`);


    };

    // Loop over the quantity of days and generate a quiz for each date
    for (let i = 0; i < quantity; i++) {
      const currentDate = new Date();
      // Gets the date for today, then decrements to generate some previous date's quizzes.
      currentDate.setDate(currentDate.getDate() - i);

      await new Promise((resolve) => setTimeout(resolve, 1000 * i));

      try {
        // Pass currentDate to handleQuizCreation
        await handleQuizCreation(currentDate);
      } catch (error) {
        console.error(
          `Error handling quiz creation for ${currentDate.toDateString()}`,
          error
        );
      }
    }

  } catch (error) {
    console.error(`Error in fetchAndStoreEvents function:`, error);
  }
};
