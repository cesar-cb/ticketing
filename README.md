# Ticketing

> ## :warning: ATTENTION: This project is under development and bugs can be found

## How to Run:

### MAC:
1. Install [`Kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
2. Install [`Docker`](https://hub.docker.com/editions/community/docker-ce-desktop-mac/)
3. Install [`Skaffold`](https://skaffold.dev/docs/install/)
4. Setup [`nginx ingress controller`](https://kubernetes.github.io/ingress-nginx/deploy/#docker-for-mac)
5. Add this line ```127.0.0.1 ticketing.dev``` to your `/etc/host` 
6. run `skaffold dev`
7. Access [ticketing.dev](http://ticketing.dev)
8. Bypass Chrome https security by type `thisisunsafe` or use another browser

### Linux: WIP, but you can try to run it with [minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)

### TL;DR
Unfotunately, we have different ways to run the project at Mac and Linux environments, for now, I'm prioritizing Mac.

This project is focused on Backend development, front end stack needs a huge improvement, such as: better file separation unit test, integrations tests, Typescript, prop types organization, an in house design system library, microfrontend concepts


The project as a whole needs some amount of improvement, I've listed some of them in the todo list bellow

### TODO:

- [ ] Revisit auth strategy
- [ ] Revisit Error Handler
- [ ] Monorepo patterns
- [ ] Layout
- [ ] Template (g8?)
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
