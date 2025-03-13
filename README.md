## Requirements

Running the demo locally requires the following:
1. Download the repo
2. Node.js 18.18 or later. Yarn is recommended but not required.
3. Python (3.8, 3.9, 3.10, 3.11, 3.12, 3.13), virtualen

## Back-end

```terminal
cd api    #../project-name/api
```
###  First Time
1. Create venv
```bash
  python -m venv venv && source venv/bin/activate 
```
2. Install dependencies
```bash
  pip install -r requirements.txt
```
###  Run server
a. If (venv) is active (ex. after First Time instructions)
```bash
  python3 manage.py runserver
````
a. If (venv) is NOT active 
```bash
  source venv/bin/activate && python3 manage.py runserver
```
### Links
Access the API at:  http://localhost:8000/api/teams

Reference: https://www.django-rest-framework.org/#requirements

## Front-end

```bash
  cd app #../project-name/app
```

```bash
  yarn install
```

```bash
  yarn dev
```
Access the app at http://localhost:3000

Reference: https://nextjs.org/docs/app/getting-started/installation

## Notes
1. There is no authentication for any of the requests
   1. I used server actions, but for larger projects I would have use MobX-State-Tree (the one I'm familiar with) or another state management library.
   1. The calls are in server actions so if there would be any API keys they won't be exposed to the client. 
1. The exercise did not ask to display teams but I added them to complete the model. 
   2. A next step would have been allowing to add existing users to a team. 
1. I come from a RoR background and I would have udpate member attributes and relation to a team in a single call. A next step would have been to do the same here. 
1. The next step for the confirmation prompt would be to use a modal.