# OrcaFlex web interface

## Setup

Create a virtual environment (venv)\
Navigate to *root*

```
pip install -r requirements.txt
flask db migrate
flask db upgrade
```

Install **NodeJS**\
Navigate to *root/frontend*

```
npm install package
```

## Launch

### Open two terminals

Navigate to *root*

#### Terminal 1
```
flask --debug run
```

#### Terminal 2
```
cd frontend
npm start
```