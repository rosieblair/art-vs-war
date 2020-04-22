# art-vs-war

This code visualizes art movements across time in conjunction with political regime changes and wars/revolutions from 1600-present day.

The timeline portion of the code maps art movements, color-coded by their duration length. Each art movement shows its name when you hover over it. Clicking on the movement bar shows a pop-up with the movement's name, start and end years, description, notable artists, and notable artworks.

Significant years are indicated by the gray vertical bars in the timeline. Hovering on the bars highlights and bolds the start and end years of a significant regime or war. Clicking on the lines shows a pop-up with the political regime's name, start and end years, leader, and regime changes, or a war's name, start and end years, cause, and description.



The second portion of the visualization is a stacked bar chart that summarizes information about artworks hosted in the Metropolitan Museum of Art, specifically paintings, drawings, photographs, and sculptures. These artworks are categorized chronologically following the timeline. Hovering over each bar details the count of these artwork types and the total count on the right side of the graph.



To run the code, navigate to the folder that the code is in, and run `python -m http.server 8080` to host the visualization locally.