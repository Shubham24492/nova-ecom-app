export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
    if (connectionString) {
      const appInsights = await import("applicationinsights");
      appInsights.default.setup(connectionString).setAutoDependencyCorrelation(true).setAutoCollectRequests(true).setAutoCollectDependencies(true).setAutoCollectConsole(true).setUseDiskRetryCaching(true).start();
    }
  }
}
