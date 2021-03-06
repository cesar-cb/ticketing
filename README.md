# Ticketing

> ## :warning: ATTENTION: This project is under development and bugs can be found

![Ticketing](https://github.com/cesar-cb/ticketing/raw/master/ticketing.gif)

## How to Run:

#### MAC:
1. Install [`Kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. Install [`Docker`](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
3. Install [`Skaffold`](https://skaffold.dev/docs/install/)
4. Setup [`nginx ingress controller`](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)
5. Add this line ```127.0.0.1 ticketing.dev``` to your `/etc/host` 
6. run `skaffold dev`
7. Access [ticketing.dev](http://ticketing.dev)
8. Bypass Chrome https security by type `thisisunsafe` or use another browser

##### How To Run Tests:
1. `docker-compose up -d` (in order to create a local database image)
2. `yarn test`

#### Linux: WIP, but you can try to run it with [minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)

## Technologies available on this project:
1. Kubernetes
2. Message driven architecture (with [NATS](https://nats.io/))
3. Skaffold, wich allow us to run the project in dev mode
4. Typeorm as ORM, using Postgres as primary database
5. NextJs provinding a **good** SSR and project template
6. [Chakra UI :heart:](https://chakra-ui.com/) an awesome design system that provides a bunch of accessibility features
7. Typescript on backend  🙌
8. others...

## TL;DR
Unfotunately, we have different ways to run the project at Mac and Linux environments, for now, I'm prioritizing Mac.

Business rules need to be improved (you can buy your own ticket), user should edit a ticket, user should upload a ticket, edit profile. But I'm focused primarily on development

This project is focused on Backend development, front end stack needs a huge improvement, such as: better file separation unit test, integrations tests, Typescript, prop types organization, an in house design system library, microfrontend concepts

It would take a long time for me to improve this project and I am considering that it is not worth the effort, the main goal here was develop my backend and DevOps skills. I still need to find a free kubernetes cluster in order to deploy this application

The project as a whole needs some amount of improvement, I've listed some of them in the todo list bellow

## TODO:

- [ ] create unit tests for remaining files
- [ ] E2E between services
- [ ] Revisit auth strategy
- [ ] Revisit Error Handler
- [ ] Monorepo patterns
- [ ] Layout
- [ ] Template ([g8?](https://github.com/foundweekends/giter8))
- [ ] add errors message to a constant
- [ ] create d.ts files
- [ ] use Helm
- [ ] Translations
- [ ] rabbitMQ or kafka
- [ ] move db connection to common
- [ ] API version ?
- [ ] add more code to common (tests, nats-wrapper, app ?, database config)
- [ ] generic forms
- [ ] route file
- [ ] Add cert-manager in order to use https in localhost
- [ ] Add eslint and prettier to common module
