## Project environment

- project setup
    ```sh
    pnpm create vite random_dogs --template react-ts
    ```

- development environment: see `engine` in `package.json`
- browser compatibility: see [vite's default browser compatibility](https://vitejs.dev/guide/build.html#browser-compatibility)

## Project decisions

- why pnpm?

  - reusing local packages, faster download speed

- why vite?

  - personal preference, easy of use & performance

- why typescript?

  - easy of development: provide type hints during development

## Things to improve

1. robust error handing
2. using browser's default video tag which has fixed aspect ratio instead of adjusting according to video size.
