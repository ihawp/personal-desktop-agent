# AIhawp

## Goal

The goal of this application is to build an automatic AI assistant that is a part of completing all tasks on your computer by providing useful insights and information.

The app will turn the AIs response into actionable tasks completed via JS / command line (that are secure, scalable, useful).

## Status

Python does Optional Character Registration on optimized (grayscaled, threshholded) screenshots of your monitors. The data discovered is sent to the Node.js server for eventual verification and rate-limiting. If you are allowed to send a message to the AI then a message will be sent, the AI (currently using Gemma3 locally) returns a response (currently not useful with this model) that is then displayed back to the user. For now, this happens infinitely.

The response of course relates the topics 'discussed' on your screen. Gemma3 struggles locally to do more than just summarize the content viewed, but it works!