# Instrumenting Code With OTEL

This repository contains a sample Node.js Express application used to demonstrate how to instrument code with OpenTelemetry (OTEL) using Cascade.

## 1. Problem Statement

Instrumenting applications with OpenTelemetry (OTEL) is crucial for modern observability but presents significant complexity. Organizations need comprehensive visibility into their distributed systems to identify performance bottlenecks, troubleshoot issues, and understand user experiences. However, manually adding OTEL instrumentation across an entire codebase requires deep technical knowledge of both the application architecture and the OTEL framework. Developers must carefully integrate tracing, metrics, and logging without introducing performance overhead or disrupting existing functionality. This process typically involves modifying numerous files, ensuring proper context propagation across service boundaries, and configuring exporters to send telemetry data to backend systems—all while maintaining code readability and maintainability.

## 2. Key Challenges

*   **Complex Configuration Setup:** Initializing the OTEL SDK with appropriate resources, exporters, and instrumentations requires detailed knowledge of the OTEL API.
*   **Comprehensive Coverage:** Ensuring all critical paths in the application are properly instrumented without missing important transactions.
*   **Context Propagation:** Maintaining trace context across asynchronous operations, service boundaries, and different execution contexts.
*   **Performance Impact:** Adding instrumentation without introducing significant overhead to application performance.
*   **Consistent Attribute Naming:** Maintaining consistency in span and attribute naming conventions across the codebase.
*   **Integration with Existing Logging:** Harmonizing OTEL with existing logging frameworks for a unified observability solution.
*   **Manual Boilerplate:** Writing repetitive instrumentation code for similar operations across different components.
*   **Keeping Up with OTEL Evolution:** The OTEL specification and libraries are still evolving, requiring ongoing maintenance.

## 3. How Windsurf Accelerates OTEL Instrumentation

*   **Automated Instrumentation Analysis and Implementation:** Windsurf can analyze the codebase structure and automatically identify key instrumentation points. Using Cascade's AI capabilities, it can generate appropriate instrumentation code for different components, such as the middleware and utility functions we see in this Express application. Windsurf can intelligently suggest where to add custom spans, what attributes to include, and how to properly propagate context across asynchronous boundaries.
*   **Intelligent Refactoring:** When OTEL libraries evolve or when instrumentation patterns need to be updated, Windsurf can help refactor existing instrumentation code across the entire codebase. It can identify all instances where instrumentation is applied and suggest consistent updates, ensuring the codebase remains aligned with current best practices.
*   **Documentation Generation:** Windsurf can automatically generate documentation that explains the instrumentation strategy, including diagrams of trace flows and explanations of key metrics. This helps new team members understand how observability is implemented in the application and how to extend it for new features.
*   **Configuration Management:** The sequential-thinking MCP can help developers reason through complex OTEL configuration decisions, such as sampling rates, exporter configurations, and resource attribute definitions. By breaking down these decisions into logical steps, Windsurf helps ensure the instrumentation is optimized for the specific application needs.
*   **Real-time Feedback:** As developers write code, Windsurf can provide real-time suggestions for improving instrumentation coverage or fixing potential issues with context propagation. This immediate feedback loop helps catch observability gaps before they reach production.

By leveraging these capabilities, Windsurf transforms what would typically be a tedious, error-prone process into a streamlined workflow that produces higher quality instrumentation with less developer effort. The result is more comprehensive observability that provides actionable insights into application behavior without sacrificing development velocity.

## Recommended Rules

### OTel Rules

1. **Standardize Naming Conventions:**  
   All services must be identified with a `service.name` attribute (e.g., `user-api`, `payment-processor`).  
   Span names should clearly describe the operation being performed, using a `verb noun` format (e.g., `HTTP GET`, `Save User`).

2. **Enrich Spans with Meaningful Attributes:**  
   Every span should be enriched with relevant attributes that provide context.  
   - For HTTP requests, include `http.method`, `http.route`, and `http.status_code`.  
   - For database calls, include `db.system` and `db.statement`.  
   - For business logic, include relevant identifiers like `user.id` or `order.id`.

3. **Prioritize Critical User Journeys:**  
   Instrumentation should focus on tracing end-to-end critical user journeys.  
   Before implementing, always create a plan that identifies these paths (e.g., user registration, product purchase) and ensures that trace context is propagated across all services involved.

---

## Recommended Workflows

### /instrument-service

This workflow guides Cascade through a comprehensive process for instrumenting a new or existing service with OpenTelemetry.

1. **Analyze Codebase:**  
   - Perform a deep analysis of the project to identify key business logic, critical user paths, and data flows.  
   - Pay special attention to API endpoints, database interactions, external API calls, and asynchronous message queues.

2. **Propose Instrumentation Plan:**  
   - Based on your analysis, create a detailed instrumentation plan. This plan must include:  
     - A list of required OpenTelemetry packages to be installed.  
     - The creation of a central `tracing.js` (or equivalent) configuration file.  
     - Modifications needed for the application's entry point to initialize tracing.  
     - Specific recommendations for adding custom spans to critical business functions (e.g., `createUser`, `processPayment`), including suggested attributes for each span.

3. **Request User Approval:**  
   - Present the complete plan to me for review.  
   - Explicitly ask: "Does this plan look good to you? Shall I proceed with the implementation?"  
   - **Do not proceed without my explicit approval.**

4. **Implement Plan:**  
   - Once I approve, execute the plan by modifying the necessary files and installing the required dependencies.  
   - After implementation, confirm that the changes have been made and the application is ready for testing.

## 4. Demo Guide

### Set-Up

*   **Model used when testing script:** Gemini 2.5 Pro
*   **Planning Mode:** ON
*   **Application to view OTEL Traces:** [otel-desktop-viewer](https://github.com/CtrlSpice/otel-desktop-viewer)

### Installation (Terminal - Brew)

```bash
brew tap CtrlSpice/homebrew-otel-desktop-viewer
brew install otel-desktop-viewer
```

### Running otel-desktop-viewer

Once installed, run `otel-desktop-viewer` in your terminal. This will launch the viewer, which you can access in your browser at `http://localhost:8080`.

---

### Presenting the Demo: A Step-by-Step Guide

#### Introduction: Setting the Stage

To begin, open the `SampleNodeExpressAPI` project in your Windsurf IDE. You can start by saying something like:

> "Getting started with OpenTelemetry is powerful, but it can be complex. Today, I'll show you how Cascade, our agentic AI coding assistant, can guide you through instrumenting a Node.js application. We won't just be writing code; we'll be building and implementing a robust observability solution from the ground up, step-by-step."

#### Step 1: Analysis and Planning

Next, demonstrate how Cascade can take a high-level goal and create a concrete plan. In the chat, enter the following prompt:

> **Prompt:**
> ```
> I want to instrument this Node.js application with OpenTelemetry. Analyze the code and propose a plan. Ensure the OpenTelemetry package versions are consistent throughout the project.
> OpenTelemetry documentation can be found at: 
> @web https://opentelemetry.io/docs/concepts/instrumentation/code-based/.
> We are using otel-desktop-viewer as an OTEL collector, documentation can be found at:
> @web  https://github.com/CtrlSpice/otel-desktop-viewer
> I want my service.name to be “SampleExpressAPI”
> ```

As you enter the prompt, explain what's happening:

> "We'll start by giving Cascade our high-level goal. We want to instrument this app, but we're not sure of the best approach. We're asking it to analyze the code, consult the official documentation we've provided, and propose a plan."

Cascade will then use its tools to explore the project and generate a step-by-step plan. You can highlight this on screen and say:

> "As you can see, Cascade has created a clear, actionable plan. It's identified the need to install specific OTEL packages, create a dedicated `tracing.js` file for configuration, and modify our main `app.js` file. This looks great, so let's tell it to proceed."

#### Step 2: Automated Implementation

Now, it's time to execute the plan. You can show the rapid sequence of Cascade's actions: modifying `package.json`, creating `tracing.js`, and updating `app.js`.

> "With our approval, Cascade gets to work. It adds the required dependencies to `package.json`, generates the core `tracing.js` file to initialize the OpenTelemetry SDK, and modifies our application's entry point. It even adds a custom span to our 'create user' route to trace that specific operation, all without us writing a single line of code."

#### Step 3: Verification and Seeing the Results

With the instrumentation in place, it's time to verify that it works. Ask Cascade to test the application:

> **Prompt:**
> ```
> Test the routes in this application, to ensure otel is instrumented correctly.
> ```

As Cascade starts the server and runs the tests, you can explain:

> "Now for the 'aha!' moment. We'll ask Cascade to start the application and test the endpoints. As it runs these tests, let's switch over to our OpenTelemetry viewer."

#### Step 4: The Complete Picture

Switch your screen to the `otel-desktop-viewer`. As the tests run, traces will appear in real-time.

> "And there it is! With just a few high-level prompts, we have a complete, rich trace showing the incoming request automatically captured by OpenTelemetry. We can see the entire lifecycle of the request through our application, from the initial HTTP request down to the specific database queries. This is the power of combining a clear plan with automated execution."

#### Conclusion: From Goal to Solution

To conclude, quickly scroll through the modified files, showing the clean, well-structured code that Cascade produced.

> "In just a few minutes, we went from a high-level goal to a fully instrumented application with a comprehensive tracing solution. Cascade didn't just write code; it understood our intent, created a plan, and executed it perfectly. That's the power of agentic AI with Cascade."
