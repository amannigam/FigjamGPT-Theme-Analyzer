# FigjamGPT Theme Analyzer Plugin

The FigjamGPT Theme Analyzer is a FigJam plugin designed to categorize selected sticky notes based on common themes and perform sentiment analysis. By leveraging the GPT API, it analyzes the text on the stickies, assigns them to appropriate categories to the best of its capability based on identified themes, and color-codes them according to sentiment: red for negative, green for positive, and blue for neutral. 

_**It's important to note that while the plugin aims for accurate categorization, there may be instances of ambiguous tagging, especially when there's a close relationship between two or more notes.**_

![Plugin Usage](/readme-media/gpt-insights.gif)

## Getting Started:
To use this plugin, you'll need to obtain a GPT API key. Follow the instructions [in this article](https://medium.com/@pawan329/how-to-generate-chat-gpt-api-key-daace2acc032) or search online for the latest tutorials on how to acquire a GPT API key.

## Steps to use the plugin

### Install the plugin

Install the plugin by import the manifest in the root folder.

![Install Plugin](/readme-media/install-plugin.gif)

### Edit the insightsoperations.py file

Open the 'api' folder and find insightsoperations.py, open it in a code editor (PyCharm etc.) and add your openAI API key for the plugin to communicate with GPT.

### Run the API 
Run the insights-api.py file from Pycharm and you will see something like this the 'run' tab which means the API is not running and plugin can communicate with GPT to
get insights.

> * Serving Flask app 'insights-api'
> * Debug mode: off
> WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
> * Running on http://127.0.0.1:5000
> Press CTRL+C to quit

### Run the Plugin in Figjam
As long as the API is running, You can now select the notes together as shown in the main GIF above, and run the installed plugin and it will generate common themes for you.

### Additional Note
On line 57 of insightsoperations.py, you will the prompt being used to trigger this operation. You can experiment with this and refine your insights. Do not change the
essence of the prompt completely since the plugin is also coded to show data in Figjam in a particular way.

