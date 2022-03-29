// Read samples.json data and create the list of ID's  
d3.json("data/samples.json").then((data)=> {
    //console.log(data)
    data.names.forEach(function(ids) {
    dropdown.append("option").text(ids).property("value")
    });

    // Call the functions to display the plots on the page
    getPlots(data.names[0]);
    getData(data.names[0]);
});

// Fill the dropdown square with ID's
let dropdown = d3.select("#selDataset");


// Create the function to get the json data for the Demographic Info window
function getData(id) {
    d3.json("data/samples.json").then((data)=> {
        
        // Get the metadata info for the demographic panel
        let metadata = data.metadata;

        // Filter meta data info by id
        let result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Select demographic panel to put data
        let demographicInfo = d3.select("#sample-metadata");
        
        // Purge the demographic info panel for each new selection
        demographicInfo.html("");

        // Grab the demographic id and add the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h4").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}



//  Plot the graphs
function getPlots(id) {
   
    // Get the data for the selected ID from the JSON file
    d3.json("data/samples.json").then((data)=> {
        //console.log(data)
        // Get the metadata info for wref
        let metadata = data.metadata;

        // Filter meta data info by id
        let result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Assign wfreq
        let wfreq = result.wfreq;
                
        // Filter values by ID 
        let samples = data.samples.filter(sample => sample.id.toString() === id)[0];
        
        // Get the top 10 values 
        let samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Get the top 10 OUT IDs.  
        let OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Get the OUT id's to the desired form for the plot
        let OTU_id = OTU_top.map(d => "OTU " + d)
  
         
        // Get the top 10 labels for the plot
       let labels = samples.otu_labels.slice(0, 10);
  
      //   console.log(`Sample Values: ${samplevalues}`)
      //   console.log(`Id Values: ${OTU_top}`)
        // Create trace variable for the plot
        let trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(68,114,196)'},
            type:"bar",
            orientation: "h",
        };
  
        // Create bar data variable
        let bar_data = [trace];
  
        // Create layout 
        let bar_layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 125,
                r: 5,
                t: 75,
                b: 0

            }
        };
  
        // Create the bar plot layout
        Plotly.newPlot("bar", bar_data, bar_layout);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // Create the bubble chart
        let trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // Create the bubble plot layout
       let bubble_layout = {
            xaxis:{title: "OTU ID"},
            yaxis:{title: "Germ Count in Sample"},
            title:{text:"Germ Types & Volumes Found"},
            height: 800,
            width: 1300
        };
  
        // Creating bubble chart data variable 
        let bubble_data = [trace1];
  
        // Create the bubble plot
        Plotly.newPlot("bubble", bubble_data, bubble_layout); 
  
        // Create the guage chart
  
        let gauge_data = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 10] },
                   steps: [
                    { range: [0, 2], color: 'rgb(217,226,243)'},
                    { range: [2, 4], color: 'rgb(191,207,235)' },
                    { range: [4, 6], color: 'rgb(156,180,224)' },
                    { range: [6, 8], color: 'rgb(112,147,210)' },
                    { range: [8, 10], color: 'rgb(68,114,196)' },
                  ]}
              
          }
        ];
        
        
        let gauge_layout = { 
            width: 550, 
            height: 600, 
            margin: { t: 20, b: 0, l:0, r:170 } 
          };
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
      });
  } 
  



// Create the change function
function optionChanged(id) {
    getPlots(id);
    getData(id);
}




