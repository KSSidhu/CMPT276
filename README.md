# CMPT 276: Product Document Release 4

### What's Changed
> ### Features completed
- Created our implemententation of Breakout
- Created our implementation of PONG
- Created our implementation of Eater (A snake-type game)
- Loads files and fixed loading bug
- Register Display and automatic updating
- Emulator can run all ROMS
- Memory, instructions, and registers displayed
- Highlighting and updating memory, instructions, and registers
- Forwards/Backwards buttons implemented
- Added dark mode
- Functioning assembler: can convert assembly into hex and binary code with input and ouptput text files

### Unintended Features
- Dark Mode
  - We thought having a darker colored UI would appeal to more users especially since most students and professors we come across use dark themes in their text editors and IDEs
  - Also a lighter color is easier to see during presentations whereas a darker colored UI may be more favorable for personal use

### Features Not Completed
- Mouse click is not responsive
  - We were not able to solve the problem where a mouse click would simulate holding down a key indefinitely


## Post-Mortem
### What Worked Well?
- Slack as communication
  - Everyone participated in slack conversations
  - Slack helped us stay in touch during weeks where we weren't able to hold in person meetings

- GitHub
  - Made sharing source code much easier
  - We could monitor who made changes to which files

- Panic/Catch-Up Week
  - We were behind especially on our emulator and visualizer
  - Having a week set aside during reading break to focus more on the project helped us get back on track

### What didn't work well?
- Segmented the work too much
  - Made reading everyone's source code difficult
  - Were unaware of each other's work

= Worked from master branch
  - Pushed all our changes to a single master branch
  - If any bugs were present it would cause conflicts with other people's work

### Biggest Challenge?
- Lost a team member early on
  - Had to rework schedule and reassign project roles just after finishing first iteration

- New Technology
  - For testing and creating project had to learn a lot of new languages and frameworks
  - Spent a lot of time researching and watching videos
  - Slowed our progress tremendously in beginning since we dealt with many bugs

### What We Would've Done Differently?
- Have more team members work on a single part of project at a time
  - Would've had more help and could bounce ideas off one another
  - Reduced bus factor for each part of project

- Started developing games earlier
  - Had to learn Octo 8 or Assembly late into term when most busy
  - Ran into many bugs

- Kept a bug log
  - Often lost track of bugs present in code
  - Some sort of Trello/Kanban board or document to keep track of current bugs, solved bugs and bugs being worked on


## Introduction
This project is to design a Chip8 Emulator for CMPT 276. It is designed for educational purposes primarily aimed at hobbyists.

## Project Organization
- Project Manger: Kirat Sidhu
- 2 Testers: Adam Tran, Kirat Sidhu
- Emulator and Visualizer Designers: James Young, Kirat Sidhu
- Game Designers: Adam Tran, Kirat Sidhu
- Chip8 Tool Designer: Chamodi Basnayake

## Communication Tools
- Slack

## Software Repository
- Git and [Github](https://github.com/KSSidhu/CMPT276)

## Testing and Quality Assurance Tools
- Unit testing will be done using JEST.js <strong>or javascript and html files</strong>
- System testing will be done using Travis CI
- Running previously created games
- UI testing may be done using Selenium Testing Tool

## Software Methodology

Implementing incremental development following a schedule of research, design, implement followed by test.


Primarily team members will be testing their own work
However, when problems arise the creators of said product must return, fix, and retest

|Product to be Tested   |Testers                 |
|  ----                 | ------                 |
|Emulator and Visualizer| Kirat and James        |
|Chip8 Tool             | Chamodi   |
|Games                  | Adam, Kirat, James    |

## Risk analysis

### Schedule Inacuracies:
- Feature implementaion estimate has been inaccurate and the group has fallen behind schedule.
- SOLUTION: We've worked over the reading break to fix bugs and will continue working on the emulator and visualizer into next release.

### Weather:
  - Due to extreme weather, the group was not able to make every meeting
  - SOLUTION: We had an extra meeting during the week in case we couldn't make the weekend meeting

### Exams and Other Courses:
  - During exam periods work may be postponed or given to other team members who aren't studying for exams.
  - Alternatively team members may focus on other components of the project until team member is free to continue.

### Experience:
  - Most members are new to JavaScript and Chip8
  - Research, research, research
  - Tutorials for both are pursued and UI design will be researched by looking into previously created projects

## Hardware and software requirements
### Language and Libraries
JavaScript, HTML, Travis CI, Jest.js

## Work breakdown

Release 1:
<ol>
  <li><del>Research Emulator and Visualizer Design</del>
  <li><del>Research automated testing</del>
  <li><del>Select Coding Language and Libraries</del>
  <li><del>Design Emulator and Visualizer, key focus on emulator</del>
  <li><del>James and Kirat Implement Design</del>
  <li><del>Primary testing method is to run small available software to see if compatible with emulator</del>
</ol>

Release 2:
<ol>
  <li><del>If required, research more on Visualizer</del>
  <li><del>Research possible useful Chip8 tools, currently considering Plugin for Sublime</del>
  <li><del>Design Visualizer, and select Chip8 Tool to build, depending on what's completed may also select games</del>
  <li><del>James and Kirat Implement design of Visualizer</del>
  <li><del>Chamodi begins implementation of Chip8 tool</del>
  <li><del>Test visualizer with available games and software, and run with created Emulator</del>
</ol>

Release 3:
<ol>
  <li><del>Select both games if haven't already</del>
  <li><del>Research possible implementations</del>
  <li> <del>Adam works on one game</del>
  <li> <del>James and Kirat, if finished with Emulator and Visualizer, can aid in game development</del>
  <li><del>Test games by running on available emulators and visualizers</del>
  <li><del>Also test on team's visualizer and emulator</del>
  <li><del>If problems arise with team's visualizer and emulator, Kirat and James will return to them to improve</del>
</ol>

Release 4:
  <ol>
  <li><del>Allocate members to work on games, or improve previous releases if needed</del>
  <li><del>Members not working on any coding parts of the project will finalize the presentation</del>
  <li><del>Emulator and Visualizer should be fully completed at this point, with no bugs</del>
  <li><del>Game designers should be able to use them freely at this point</del>
  <li><del>Designers will test games on our own emulators and visualizers along with publicly available ones</del>
  </ol>
  

## Project Schedule

### Meeting Schedule
- Every Saturday at 1:00 pm - 2:00 pm

### Release 1: Chip8 Emulator -> Estimate: 20 Hrs
 Actual Time: 40 hrs
  > - <del>Research: Jan. 8 - 12</del>
  > - <del>Design Two Weeks: Jan. 12 - Jan. 26</del>
  > - <del>Test: Jan. 26 - Feb. 6</del>
  > - <del>Submit Feb. 6</del>

### Release 2: Chip8 Visualizer -> Estimate: 100 Hrs
Actual Time: 120 hrs
> - <del>Research: Jan. 14 - 19</del>
> - <del>Design Two Weeks: Jan. 20 - Feb. 20</del>
> - <del>Test: Feb. 20 - Feb. 26</del>
> - <del>Submit Feb. 27</del>

#### Release 3: Chip8 Plugin -> Estimate: 240 Hrs
Actual Time: 240 hrs
> - <del>Research: Feb. 18 - 27</del>
> - <del>Design Two Weeks: Feb. 27 - Mar. 6</del>
> - <del>Test: Mar. 6 - Mar. 12</del>
> - <del>Submit Mar. 13</del>

#### Release 4: Chip8 Games: <strong>Breakout, PONG, Eater -> Estimate: 200 Hrs
Actual Time: 210 hrs
> - <del>Research Game Design: Mar. 13 - Mar. 20</del>
> - <del>Create Presentation: Mar. 20 - Mar. 27</del>
> - <del>Design Two Weeks: Mar. 20 - Apr. 3</del>
> - <del>Test: Apr. 3 - Apr. 7</del>
> - <del>Submit Apr. 8</del>
> - <del>Presentation Apr. 8</del>

## Monitoring and reporting mechanisms

Main communication and updates through Slack, and submit changes to implementation onto Github. Weekly Meetings go over major design changes and general planning. Reports on progress are discussed through weekly meetings and on Slack. 
