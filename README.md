# Pente  
The 1977 abstract strategy game as a web app!  
  
During a tic-tac-toe exercise on my way through [The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/tic-tac-toe), I really wanted to do two things:  
- Challenge myself to write a deliverable product that's prepared for massive expansion later on  
- Build a more interesting game than, pshh, tic-tac-toe.  

And that's what this repository does! Below, I'll detail a bit of the learning process around the project.  
  
## Challenges  
The most difficult part of the project (and the most educational part of it) was organizing the code. Since this stage of The Odin Project focuses on methods of organization in code, this makes sense. In this case, the best solution was consolidating as much of the global variables as possible into discrete modules/objects: it just made the whole project easier to conceptualize and read.  
  
Another significant challenge was, while expanding the original tic-tac-toe game, adapting my variable names. I began to quickly discover that, while I thought a function name was quite descriptive, it would quickly become obscure and worthless after introducing a function that was just too closely related.  

## Structure  
So, how was the global namespace consolidated into discrete modules/objects? This was the best structure I could think of:
- A GameBoard module
- A GameFlow module
- Two player-Objects

With each structure featuring a variety of public and private attributes. If you'd like a closer look at how they interact, I'd invite you to take a look at script.js yourself!  
  
Lastly, I'd love to invite any feedback on this project whatsoever. 
  
Thank you!
