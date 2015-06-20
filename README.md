# shows

Sample [LoopBack](http://loopback.io) application with TV shows and episodes, designed to demonstrate a **modern REST API** built upon the following (upcoming) **W3C hypermedia standards** :

- [Schema.org](http://schema.org/)
- [JSON-LD](http://json-ld.org/)
- [Hydra](http://www.markus-lanthaler.com/hydra/)

## Get started

```
npm install
sudo npm install -g nodemon
nodemon .
```

## Toy around

```
curl -X POST -d "name=Community&year=2009" http://0.0.0.0:3000/api/shows
curl -X POST -d "name=Pilot&season=1&number=1" http://0.0.0.0:3000/api/shows/1/episodes
```
