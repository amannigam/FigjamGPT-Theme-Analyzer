# Figjam-GPT Themes Extractor Plugin

![Plugin Usage](/readme-media/gpt-insights.gif)

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

