# Bunper: A Lightweight Web Framework for Bun

Bunper is an in-progress, lightweight web framework designed for the Bun runtime, tailored specifically for small to medium-sized projects. While currently not in its stable release, Bunper offers a streamlined approach to building server-side JavaScript applications, combining structured request handling, intuitive routing, and robust middleware support into a developer-friendly package.

## Features

- **Simple Yet Powerful Routing**: Define routes with ease, supporting all standard HTTP methods, optimized for simplicity and performance.
- **Middleware Integration**: Incorporate essential middleware functions effortlessly to augment your application's capabilities.
- **Preliminary Error Handling**: Benefit from basic error handling mechanisms to keep your application running smoothly.
- **TypeScript Friendly**: Enjoy the benefits of TypeScript for more reliable and maintainable code.
- **Optimized for Small Projects**: Designed with simplicity and efficiency in mind, making it an ideal choice for smaller-scale applications.

## Getting Started

### Prerequisites

Ensure you have the latest version of [Bun](https://bun.sh/) installed on your system.

### Installation

Bunper is available on npm and can be easily installed using Bun:

```bash
# Install Bunper using Bun
bun install bunper
```

### Basic Usage

Here's a simple example to get your Bunper application up and running:

```typescript
import {Bunper, requestLogger, success, error} from 'bunper';

// Initialize your Bunper application without adding default middlewares
const app = new Bunper({addDefaultMiddlewares: false});

// Add middleware
app.use(requestLogger);

// Create a custom middleware yourself
const errorHandler = (error: any, request: Request, response: Response, next: Function) => {
    return error({message: "Internal server error"}, 500);
};
app.use(errorHandler);

// Define a simple get route
app.get('/', (req, params) => {
    console.log("SHIT")
    return success({message: "Welcome to Bunper!"})
});

// Define a simple post route
app.post('/', (req, params) => {
    console.log(req.body);
    return success({message: "Your message was received!"});
});

// Define a simple pattern route
app.get("/sum/:a/:b", async (req, params) => {
    const a = parseInt(params.a, 10);
    const b = parseInt(params.b, 10);
    const c = a + b;
    return success(`${a} + ${b} = ${c}`)
});

// Start your server on port 3000
app.listen(3000);

```

## Documentation

As Bunper is currently in development, detailed documentation may be incomplete. We welcome your input and contributions to improve and expand our documentation.

## Contributing

Bunper is in its early stages, and we appreciate your patience and support as we work towards a stable release. Contributions, feedback, and constructive criticism are highly encouraged.

Feel free to fork the repository, submit pull requests, or open issues to suggest improvements or report bugs.

## Stability Notice

Please note that Bunper is currently under active development. The framework is not yet stable, and the API is subject to change. We recommend using Bunper for experimental projects and look forward to your contributions towards a stable release.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

[Email](mailto:ahmadrezakml@gmail.com) | [Telegram](https://ahmadrezadl.t.me) | [Twitter](https://twitter.com/Ahmadrezadlo_O)

Your contributions and feedback will play a significant role in shaping the future of Bunper. We're excited to embark on this journey with you!