// /**
//  * bring in the brain.js dependency
//  */
// const brain = require('brain.js')
// /**
//  * Import the data file
//  */
// const data = require('./data.json')


// /**
//  * Create a new brain.js network
//  * Long Short-Term Memory(LTSM)
//  * LSTM is designed to avoid long-term dependency problems.
//  */

// const network = new brain.recurrent.LSTM()

// /**
//  * Training the model and setting the number 
//  * of iteration to make during the training
//  */


// const trainingData = data.map(item => ({
//     input: item.id,
//     output: item.name
//   }));


// network.train(trainingData, {
//   iterations: 2000
// })

// /**
//  * Supply the input to classify
//  */
// const output = network.run('i want to see 90')


// /**
//  * Printing the output on the console
//  */
// console.log(`Category: ${output}`)


const brain = require('brain.js');
const data = require('./data.json');

// flatten keywords into an array
const keywords = data.reduce((acc, val) => acc.concat(val.keywords), []);

// create a set of unique keywords
const uniqueKeywords = new Set(keywords);

// create a dictionary of keyword frequencies for each category
const keywordFrequencies = data.reduce((acc, val) => {
  const frequencies = {};
  uniqueKeywords.forEach(keyword => frequencies[keyword] = 0);
  val.keywords.forEach(keyword => frequencies[keyword] += 1);
  acc[val.name] = frequencies;
  return acc;
}, {});

// create training data
const trainingData = [];
data.forEach(category => {
  category.keywords.forEach(keyword => {
    const input = {};
    input[keyword] = 1;
    trainingData.push({
      input,
      output: { [category.name]: 1 }
    });
  });
});

// create neural network
const net = new brain.NeuralNetwork();

// train neural network
net.train(trainingData);

// test neural network
const testPhrase = "a funny comedy movie";
const output = net.run({ "funny": 1, "comedy": 1 });
console.log(output);