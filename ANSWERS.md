1. How to Run the Project

This project is a frontend-based Pomodoro Timer developed using HTML, CSS, and JavaScript. For development purposes, the project can run using Visual Studio Code with the Live Server extension:
Steps to run the project:
i. Open the project folder in VS Code.
ii. Install the “Live Server” extension.
iii. Right-click on index.html.
iv. Select Open with Live Server.
No external libraries or package installations are required.

2. Stack and Design Choices

The project was developed using HTML, CSS, and JavaScript because this stack is lightweight, easy to manage, and suitable for a timer-based application. Since the project mainly focuses on DOM manipulation, timing functionality, and user interaction, using a frontend framework was unnecessary for this scope.
Design Choice 
1: Centered Card Layout
The entire application is placed inside a single centered card with a maximum width of 500px. The Pomodoro technique is intended to help users focus on one task at a time, so I wanted the timer to remain the primary visual element on the screen. A compact centered layout reduces distractions and keeps all controls within easy reach.
2: Visual Progress Bar
A progress bar was added below the timer to visually represent session completion because a numerical timer alone does not always give a strong sense of progression. The progress bar provides visual feedback and helps users quickly understand how much time has passed in the current focus or break session.

3. Responsive & accessibility

The application was designed to work on both mobile and desktop devices. 
On a 360px-wide mobile screen:
    The settings section changes from horizontal to vertical layout.
    Buttons stack into a single column.
    The timer font size becomes smaller to fit properly on narrow screens.
On a 1440px laptop screen:
    The timer card remains centered with balanced spacing.
    The large timer display remains visually dominant.
    The layout maintains readability without stretching excessively.
One accessibility feature I implemented was disabling buttons when actions are not valid.The pause button is disabled before the timer starts. The resume button is disabled unless the timer is paused.

4. AI Usage

I used ChatGPT and deepSeek throughout the development of this project. The tool was mainly used during the JavaScript development phase to help implement the Pomodoro timer functionality correctly.
AI assistance was used in the following areas:
    Debugging issues related to pause, resume, and reset functionality
    Improving the progress bar calculation so it accurately reflects session completion
    Helping structure local storage logic for saving and rendering daily focus history
One specific modification i made to the Ai-generated output was in the layout of the button section. The initial version suggested a fixed layout approach, which was not responsive on smaller screens. I improved this by converting the button container into a CSS grid system:
.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
I further enhanced responsiveness by adding a media query to adjust the layout on mobile devices:
@media (max-width: 500px) {
  .button-group {
    grid-template-columns: 1fr;
  }
}
It ensured that the interface adapts properly across different screen sizes and improves usability on mobile devices.

5. Honest gap

One part of the project that is not fully polished is the lack of persistent session state for the timer itself.
Currently, if the page is refreshed or accidentally closed, the timer resets completely and the user loses the ongoing session progress. Although the application uses localStorage to store completed focus session history, it does not store the active timer state (remaining time, current mode, or pause status).