const Queue = require("bull");
const moment = require("moment");
const fs = require("fs");
const path = require("path");

module.exports = class Queueable {
  constructor() {
    if (this.constructor === Queueable) {
      throw new Error("Abstract class can't be instantiated.");
    }
    this.checkMethodImplementations();
    this.derivedClassName = this.constructor.name;
  }

  checkMethodImplementations() {
    const abstractMethods = ["handler"];
    // Check if the required method is implemented in the derived class
    abstractMethods.forEach((method) => {
      if (typeof this[method] !== "function") {
        throw new Error(
          `Method '${method}' must be implemented in derived classes.`
        );
      }
    });
    return true;
  }

  dispatch(...args) {
    this.dispatchArgs = args;
    this.queueHandler();
  }

  queueHandler() {
    const instance = this.queueInstance();

    instance.add(this.dispatchArgs);

    instance.process(async (job, done) => {
      try {
        this.processStartAt = moment();
        console.log(
          `\x1b[33m[${this.processStartAt.format("YYYY-MM-DD HH:mm:ss")}] ${
            this.derivedClassName
          } queue processing... \x1b[0m`
        );
        const result = await this.handler(...job.data);
        done(null, result);
      } catch (err) {
        done(null, false);
      }
    });

    instance.on("completed", (job, result) => {
      const processEndAt = moment();
      const duration = processEndAt.diff(this.processStartAt);
      if (!result) {
        console.log(
          `\x1b[31m[${processEndAt.format("YYYY-MM-DD HH:mm:ss")}] ${
            this.derivedClassName
          } queue failed in ${duration} milliseconds\x1b[0m`
        );
        this.failed(job, result);
      } else {
        console.log(
          `\x1b[32m[${processEndAt.format("YYYY-MM-DD HH:mm:ss")}] ${
            this.derivedClassName
          } queue processed in ${duration} milliseconds \x1b[0m`
        );
        this.completed(job, result);
      }
    });
  }

  queueInstance() {
    const configFilePath = path.resolve(process.cwd(), "queueable.config.js");

    let defaultConfig = {
      redis: {
        host: "127.0.0.1",
        port: 6379,
        username: "",
        password: "",
      },
    };

    if (fs.existsSync(configFilePath)) {
      const queueableConfig = require(configFilePath);
      defaultConfig = { ...defaultConfig, ...queueableConfig };
    }

    return new Queue(this.derivedClassName, {
      redis: defaultConfig.redis,
    });
  }

  completed(job, result) {}

  failed(job, result) {}
};
