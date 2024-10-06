const https = require('https');
import { AppDataSource } from "../config/database";
import { Event, Quiz, QuizEvent} from "../entities";

export const fetchAndStoreEvents = async () => {

    try {
        // Get date formatted correctly
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long'});
        const day = date.getDate();
        const formattedDate = `${month} ${day}`;

        // Check if we have a quiz for this day already
        const quizRepository = AppDataSource.getRepository(Quiz);
        const existingQuiz = await quizRepository.findOne({ where: {quiz_date: date}});
        if (existingQuiz) {
            console.log(`Quiz for ${date} exists. Skipping event fetching.`);
            return;
        }

        const url = `https://history.muffinlabs.com/date${month}/${day}`;

        https.get(url, (response: any) => {

            let data = '';

            response.on('data', (chunk: any) => {
                data += chunk
            });

            response.on('end', async () => {
                try {
                    const jsonData = JSON.parse(data);
                    let events = jsonData.data.Events;

                    events.sort(( a: { year: string; }, b: { year: string; }) => parseInt(a.year, 10) - parseInt(b.year, 10));

                    const firstEventYear = parseInt(events[0].year, 10);
                    const endEventYear = parseInt(events[events.length - 1].year, 10);
                    const totalSpan = endEventYear - firstEventYear;
                    const numberOfEvents = 8;
                    const interval = totalSpan / (numberOfEvents - 1);

                    const quiz = new Quiz();
                    quiz.quiz_date = new Date();
                    await quizRepository.save(quiz);

                    const eventRepository = AppDataSource.getRepository(Event);
                    const quizEventRepository = AppDataSource.getRepository(QuizEvent);
                    let order = 1;
                    let lastEventYear = firstEventYear;
                    let eventCount = 0;
                    
                    for (const item of events) {
                        const currentYear = parseInt(item.year, 10);

                        if (currentYear - lastEventYear >= interval && eventCount < numberOfEvents) {

                            const event = new Event();
                            event.type = 'Event';
                            event.year = parseInt(item.year, 10);
                            event.description = item.text;
                            event.description = item.html;
                            event.date = formattedDate;
                            event.source_url = `https://history.muffinlabs.com/date${month}/${day}`;
                            event.links = item.links;
    
                            await eventRepository.save(event);

                            // Add event to the quiz

                            const quizEvent = new QuizEvent();
                            quizEvent.quiz = quiz;
                            quizEvent.event = event;
                            quizEvent.order = order++;
                            await quizEventRepository.save(quizEvent);

                            lastEventYear = currentYear;
                            eventCount ++
                        }

                    }

                    console.log(`Events fetched and quiz generated successfully`);
                } catch (error) {
                    console.error(`Error parsing JSON or saving events:`, error);
                }
            });

        }).on(`error`, (error: any) => {
            console.error(`Error fetching events from MuffinLabs API:`, error);
        });


    } catch (error) {
        console.error(`Error in fetchAndStoreEvents function:`, error)
    }
}
