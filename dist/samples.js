const make = (title, items) => ({
  title,
  questions: items.map(([prompt, choices, answerIndex, explanation]) => ({ prompt, choices, answerIndex, explanation })),
});

export const samples = [
  make('Essential skills for property agents', [
    ['A buyer wants a home near work but has a strict monthly budget. What should you do first?', ['Schedule the most popular listing', 'Clarify total budget, commute limits, and deal-breakers', 'Lead with the largest discount', 'Ask the buyer to rank listing photos'], 1, 'Qualification turns broad preferences into criteria you can apply before arranging viewings.'],
    ['The owner says a listing is available, but the office record shows it as reserved. What should you do?', ['Publish both statuses', 'Promise a viewing and check later', 'Use the newest record automatically', 'Confirm the status with the owner and update the shared record'], 3, 'Verify availability at the source, then make sure the team works from the same information.'],
    ['Two leads ask about the same unit. How should you track follow-ups?', ['Record the next step and due date for each lead', 'Keep one undifferentiated note on the listing', 'Wait for the first offer before following up', 'Use read receipts as the only record'], 0, 'Separate records preserve context, ownership, and due dates for both leads.'],
    ['A buyer asks if a planned transit project will guarantee higher resale value. What is the best reply?', ['Use the owner’s price as a forecast', 'Avoid discussing the project', 'Share verified project details and explain the uncertainty', 'Promise an increase based on another area'], 2, 'A planned amenity can matter to buyers, but its timing and impact on resale prices are uncertain.'],
    ['A listing gets many clicks but few viewing requests. What should you check?', ['Only whether clicks rose this week', 'Listing details, comparable prices, and the booking path', 'Only the number of photos', 'Only the most expensive listing nearby'], 1, 'A price mismatch, missing information, or booking friction can each explain the drop-off.'],
  ]),
  make('Reading Jakarta property market updates', [
    ['A hypothetical report says median asking prices rose 6%. What does that statistic establish?', ['Final sale prices rose 6%', 'Every district became more expensive', 'The median advertised price rose in the measured listings', 'Buyer demand rose 6%'], 2, 'Asking prices describe offers. Closed prices and demand require separate evidence.'],
    ['A report shows longer days on market and more active listings. What would help you check for weaker demand?', ['Seasonality, listing mix, and closed sales', 'This week’s most-viewed listing', 'The city’s highest advertised price', 'Your office’s new leads alone'], 0, 'Time periods, property mix, and transaction evidence help separate competing explanations.'],
    ['Which comparisons are strongest for a South Jakarta apartment?', ['All apartments in Jakarta', 'Any listings with the same asking price', 'Nearby landed homes', 'Recent apartments in the same submarket with similar size and condition'], 3, 'Comparing similar properties reduces differences unrelated to the unit.'],
    ['In a hypothetical quarter, prices within each tier stay flat, but more luxury units are listed. Why could the overall median rise?', ['Sale prices must rise first', 'A larger share of expensive units can shift the median', 'The median always rises with sample size', 'Entry-level units necessarily got more expensive'], 1, 'A change in listing mix can move the aggregate even when prices within each tier stay flat.'],
    ['A chart gives a vacancy figure without a date or methodology. What should you do before quoting it?', ['Use it if the chart looks recent', 'Round the figure', 'Verify the source, period, coverage, and definition', 'Average it with another city’s figure'], 2, 'A vacancy figure only supports a claim when you know what and when it measures.'],
  ]),
];
