

# Introduction
Building Permit Process Enhancement using Machine Learning

The process to obtain a building permit in San Jose is slow and tedious, primarily due
to the fact that a city staff member must review each and every permit application in order for
them to be approved. This process could be improved by training a model to handle some, if
not most of the review.

# Current Problem:
The current system, a building permit in San Jose can take several weeks or even months to obtain, which can prove to be a daunting task for homeowners and contractors. Some municipal agencies provide review services which take place before the application is submitted. However, not only does this require the homeowner or building contractor to physically visit the office to get their application reviewed, but they might even have to visit multiple times if the review process becomes iterative.

# Solution:
In order to address these issues, our team has created a Building Permit Prediction Service website which enables users to submit a permit application online and see if their application will be approved, eliminating any need to physically visit the office. Users are able to enter their application details, which consist of specific measurements or qualities of the construction depending on the type of permit desired. Upon submitting the application, the website will provide a prediction for whether or not their application will be approved. The prediction is the result of applying a machine learning model which has been trained on historical permit review data. This website will substantially reduce visits to the city office for reviews for people seeking permits, and will also greatly reduce and streamline the workloads of city employees.

# Website URL
http://34.201.136.52:8004/

# Architecture Diagram

![arch](https://user-images.githubusercontent.com/31807232/34096662-0194fd8c-e38b-11e7-8bbc-a89f3c64150f.png)

# Technology Stack
* NodeJS
* Express
* MongoDB
* Amazon Web Services
* HTML/CSS

# Contributors
1. Arpita Saha
2. Jiaqi Qin
3. Matthew Kwong
4. Pritam Meher

# Future Scope:
* Provide table sorting/filtering, e.g. so that admins can view only applications which are pending.
* Add useful graphs or statistics to the admin page, to enable more complex analysis.
* Support other permit application types. For the purposes of providing a proof of concept, we chose to demonstrate a basement permit application, but there are several other permit application types available in San Jose, and the service could easily be extended to support them.
* Incorporate building plans/blueprints into the machine learning process. Users could be required to upload an image of their building plans or blueprints, computer vision techniques could be used to analyze the image, and the result could be used as a part of the machine learning model.
