# CMPT 276: Product Document Release 1


## Introduction
This project is to design a Chip8 Emulator for CMPT 276. It is designed for educational purposes primarily aimed at hobbyists.

## Project Organization
- Project Manger: Kirat Sidhu
- 2 Testers: Adam Tran, Chamodi Basnayake
- Emulator and Visualizer Designers: James Young, Kirat Sidhu
- Game Designers: Adam Tran, **Kirat Sidhu, James Young**
- Chip8 Tool Designer: Chamodi Basnayake

### Communication Tools
- Slack

### Software Repository
- Git and [Github](https://github.com/KSSidhu/CMPT276)

### Testing and Quality Assurance Tools
- **Unit testing will be done using JEST.js**
- **System testing will be done using Travis CI**
- Running previously created games
- **UI testing may be down using Selenium Testing Tool**

### Software Methodology

**Implementing incremental development following a schedule of research, design, implement followed by test.**


Primarily team members will be testing their own work
However, when problems arise the creators of said product must return, fix, and retest

|Product to be Tested   |Testers                 |
|  ----                 | ------                 |
|Emulator and Visualizer| Kirat and James        |
|Chip8 Tool             | Chamodi and Aloshius   |
|Games                  | **Adam, Kirat, James**    |

## Risk analysis

#### Current Risks:
- Aloshius dropped the course
  - Course of Action: Kirat and James will work on games once the emulator and visualizer are finished

##### Exams and Other Courses:
  - During exam periods work may be postponed or given to other team members who aren't studying for exams.
  - Alternatively team members may focus on other components of the project until team member is free to continue.

##### Experience:
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
  <li>Design Visualizer, and <del>Select Chip8 Tool to build, depending on what's completed may also select games</del>
  <li>James and Kirat Implement design of Visualizer
  <li>Chamodi begins implementation of Chip8 tool
  <li>Test visualizer with available games and software, and run with created Emulator
  <li>Test tool with Sublime and recreate Emulator to test if runs accordingly
</ol>

Release 3:
<ol>
  <li><del>Select both games if haven't already</del>
  <li>Research possible implementations
  <li> <strong>Adam works on one game</strong>
  <li> <strong>James and Kirat, if finished with Emulator and Visualizer, can aid in game development</strong>
  <li>Test games by running on available emulators and visualizers
  <li>Also test on team's visualizer and emulator
  <li>If problems arise with team's visualizer and emulator, Kirat and James will return to them to improve
</ol>

Release 4:
  <ol>
  <li>Allocate members to work on games, or improve previous releases if needed
  <li>Members not working on any coding parts of the project will finalize the presentation
  <li>Emulator and Visualizer should be fully completed at this point, with no bugs
  <li>Game designers should be able to use them freely at this point
  <li>Designers will test games on our own emulators and visualizers along with publicly available ones
  </ol>
  

## Project Schedule

### Meeting Schedule
- Every Saturday at 1:00 pm - 2:00 pm

### Project Scheduling

#### Release 1: Chip8 Emulator -> 50 Hrs
 **Actual Time: 40 hrs**
  > - <del>Research: Jan. 8 - 12</del>
  > - <del>Design Two Weeks: Jan. 12 - Jan. 26</del>
  > - <del>Test: Jan. 26 - Feb. 6</del>
  > - <del>Submit Feb. 6</del>

##### Release 2: Chip8 Visualizer -> 50 Hrs
> - <del>Research: Jan. 14 - 19</del>
> - Design Two Weeks: **Jan. 20 - Feb. 20**
> - Test: **Feb. 20 - Feb. 26**
> - Submit Feb. 27

##### Release 3: Chip8 Plugin -> 60 Hrs
> - Research: Feb. 18 - 27
> - Design Two Weeks: Feb. 27 - Feb. 6
> - Test: Mar. 6 - Mar. 12
> - Submit Mar. 13

##### Release 4: Chip8 Games: Space Invaders, Snake -> 50 Hrs
> - Research Game Design: Mar. 13 - Mar. 20
> - Create Presentation: Mar. 20 - Mar. 27
> - Design Two Weeks: Mar. 20 - Apr. 3
> - Test: Apr. 3 - Apr. 7
> - Submit Apr. 8
> - Presentation Apr. 8

### Major Features Completed
- Functioning Chip8 Emulator
- Runs most opcodes and passes tests
- Prototype of HTML interface

### Features Not Completed
- All opcodes apart from ones that interact with the display have been tested
- Keyboard mapping
  - Time was spent learning JEST.js, resulting in not enough time to learn and implement the keyboard mapping

### Major Features For Next Release
- Release 2: Chip8 Visualizer

Chip8 Emulator :
- Keyboard mapping
- Opcodes
- Processor implementation
- Loading ROMs

Chip8 Visualizer :
- Further UI Design
- Keyboard Tracking and Log
- Integration with Emulator with Memory and Registry displaying on Visualizer
- Help Button implementation

### Monitoring and reporting mechanisms

Main communication and updates through Slack, and submit changes to implementation onto Github. Weekly Meetings go over major design changes and general planning. Reports on progress are discussed through weekly meetings and on Slack. 
