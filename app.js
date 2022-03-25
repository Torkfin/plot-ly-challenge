// Read samples.json data 
d3.json("data/samples.json").then((data)=> {
//    console.log(data)

// Assign the data to the dropdwown menu
data.names.forEach(function(name) {
dropdown.append("option").text(name).property("value");
});

// Call the functions to display the data and the plots to the page
getPlots(data.names[0]);
getData(data.names[0]);
});


// Fill dropdown data
let dropdown = d3.select("#selDataset");

// Create the change event function
function optionChanged(id) {
    getPlots(id);
    getData(id);
}

//  Plot the graphs
function getPlots(id) {
   
   
    // Get the data from the JSON file
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
        // Get the metadata info for wref
        let metadata = data.metadata;

        // Filter meta data info by id
        let result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Assign wfreq
        let wfreq = result.wfreq;
                
        // Filter values by ID 
        let samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        // Get the top 10 values 
        let samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Geth the top 10 OUT IDs.  
        let OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
        let OTU_id = OTU_top.map(d => "OTU " + d)
  
         
        // get the top 10 labels for the plot
       let labels = samples.otu_labels.slice(0, 10);
  
      //   console.log(`Sample Values: ${samplevalues}`)
      //   console.log(`Id Values: ${OTU_top}`)
        // create trace variable for the plot
        let trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(68,114,196)'},
            type:"bar",
            orientation: "h",
        };
  
        // create data variable
        let bar_data = [trace];
  
        // create layout variable to set plots layout
        let bar_layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 175,
                r: 75,
                t: 75,
                b: 0

            }
        };
  
        // create the bar plot
        Plotly.newPlot("bar", bar_data, bar_layout);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // The bubble chart
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
  
        // set the layout for the bubble plot
       let bubble_layout = {
            xaxis:{title: "OTU ID"},
            yaxis:{title: "Germ Count in Sample"},
            title:{text:"Germ Types & Volumes Found"},
            height: 800,
            width: 1300
        };
  
        // creating data variable 
        let bubble_data = [trace1];
  
        // create the bubble plot
        Plotly.newPlot("bubble", bubble_data, bubble_layout); 
  
        // The guage chart
  
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
            margin: { t: 20, b: 40, l:0, r:100 } 
          };
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
      });
  } 
  

// Create the function to get the necessary data
function getData(id) {
    d3.json("data/samples.json").then((data)=> {
        
        // Get the metadata info for the demographic panel
        let metadata = data.metadata;

        // Filter meta data info by id
        let result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Select demographic panel to put data
        let demographicInfo = d3.select("#sample-metadata");
        
        // Purge the demographic info panel each time new selection
        demographicInfo.html("");

        // Grab the demographic id and add the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Create the function for the change event
function optionChanged(id) {
    getPlots(id);
    getData(id);
}

