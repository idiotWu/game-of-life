## Requirement

- Node.js 10+ ([download](https://nodejs.org))

## Install

1. Clone this repository: `git clone git@github.com:idiotWu/game-of-life.git`
2. Install npm dependencies: `npm install`

## Usage

```
Usage: npm start -- [options]

Options:
  --out-dir <dir>   Set output directory, default to ./stat
  --threads <n>     Set the number of multi-threads, default is 4
  --size <n>        Set world size, default is 100
  --count <n>       Set the number of worlds, default is 1000
  --range <a>..<b>  Set the range of initial alive cell density, default is [10,90]
  --step <n>        Set the value to increase initial density by, default is 10
  --records <n>     Set the maximum number of records, default is 10
  -h, --help        output usage information
```

For example, the following command generates a 300*300 world:

```bash
npm start -- --size 300
```

## License

[MIT](LICENSE)
