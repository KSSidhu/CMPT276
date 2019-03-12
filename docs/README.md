# CMPT 276: Product Document Release 3

### What's Changed
> ### Features completed
- Finalized design of HTML interface
- Register Display and automatic updating
- Created HTML page to display all tests
- Emulator can run all ROMS
- Memory, instructions, and registers displayed
- Highlighting and updating memory, instructions, and registers
- Forwards/Backwards buttons implemented
- Added NavBar and added github and buttons there
- Decided on OCTO 8 online editor to create games
- Added ball movement and paddle control to brick breaker

> ### Features Not Completed
- Mouse click is not responsive

## Major Features For Next Release
- Release 4: Chip8 Games

- Game 1: Snake

- Game 2: Brick Breaker

Chip8 Tool:
- Fully completed and begin implementation if not fully implemented by end date

Chip8 Emulator :
- Fix Bugs
  - Continue current emulation if user decides to exit loading a new game

Chip8 Visualizer :
- Fix bugs
- Improve mouse input


## Introduction
This project is to design a Chip8 Emulator for CMPT 276. It is designed for educational purposes primarily aimed at hobbyists.

## Project Organization
- Project Manger: Kirat Sidhu
- 2 Testers: Adam Tran, Chamodi Basnayake
- Emulator and Visualizer Designers: James Young, Kirat Sidhu
- Game Designers: Adam Tran, Kirat Sidhu, James Young
- Chip8 Tool Designer: Chamodi Basnayake

## Communication Tools
- Slack

## Software Repository
- Git and [Github](https://github.com/KSSidhu/CMPT276)

## Testing and Quality Assurance Tools
- Unit testing will be done using javascript and html files
- System testing will be done using Travis CI
- Running previously created games

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

### Current Risks:
- <strong>Feature implementaion estimate has been inaccurate and the group has fallen behind schedule.</strong>
- <strong>SOLUTION: We've worked over the reading break to fix bugs and will continue working on the emulator and visualizer into next release. </strong>

### Release 1 Risks:
- <strong>Weather
  - Due to extreme weather, the group was not able to make every meeting
  - SOLUTION: We had an extra meeting during the week in case we couldn't make the weekend meeting</strong>

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
  <li>Test tool with Sublime and recreate Emulator to test if runs accordingly
</ol>

Release 3:
<ol>
  <li><del>Select both games if haven't already</del>
  <li><del>Research possible implementations</del>
  <li> <del>Adam works on one game</del>
  <li> <del>James and Kirat, if finished with Emulator and Visualizer, can aid in game development</del>
  <li> <del>Test games by running on available emulators and visualizers</del>
  <li> <del>Also test on team's visualizer and emulator</del>
  <li>If problems arise with team's visualizer and emulator, Kirat and James will return to them to improve
</ol>

Release 4:
  <ol>
  <li> <del>Allocate members to work on games, or improve previous releases if needed</del>
  <li>Members not working on any coding parts of the project will finalize the presentation
  <li>Emulator and Visualizer should be fully completed at this point, with no bugs
  <li>Game designers should be able to use them freely at this point
  <li>Designers will test games on our own emulators and visualizers along with publicly available ones
  </ol>
  

## Project Schedule

### Meeting Schedule
- Every Saturday at 1:00 pm - 2:00 pm

### Release 1: Chip8 Emulator -> 50 Hrs <strong>each member</strong>
 Actual Time: 40 hrs
  > - <del>Research: Jan. 8 - 12</del>
  > - <del>Design Two Weeks: Jan. 12 - Jan. 26</del>
  > - <del>Test: Jan. 26 - Feb. 6</del>
  > - <del>Submit Feb. 6</del>

### Release 2: Chip8 Visualizer -> 50 Hrs <strong>each member</strong>
<strong>Actual Time: 120 hrs</strong>
> - <del>Research: Jan. 14 - 19</del>
> - <del>Design Two Weeks: Jan. 20 - Feb. 20</del>
> - <del>Test: Feb. 20 - Feb. 26</del>
> - <del>Submit Feb. 27</del>

#### Release 3: Chip8 Plugin -> 60 Hrs <strong>each member</strong>
> - <del>Research: Feb. 18 - 27</del>
> - <del>Design Two Weeks: Feb. 27 - Mar. 6</del>
> - <del>Test: Mar. 6 - Mar. 12</del>
> - <del>Submit Mar. 13</del>

#### Release 4: Chip8 Games: Space Invaders, Snake -> 50 Hrs <strong>each member</strong>
> - <del>Research Game Design: Mar. 13 - Mar. 20</del>
> - Create Presentation: Mar. 20 - Mar. 27
> - Design Two Weeks: Mar. 20 - Apr. 3
> - Test: Apr. 3 - Apr. 7
> - Submit Apr. 8
> - Presentation Apr. 8

## Monitoring and reporting mechanisms

Main communication and updates through Slack, and submit changes to implementation onto Github. Weekly Meetings go over major design changes and general planning. Reports on progress are discussed through weekly meetings and on Slack. 
