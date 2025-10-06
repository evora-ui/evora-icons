import type { Component } from "vue";

declare module "vue" {
  export interface GlobalComponents {
    EvIcon: typeof import("./index").EvIcon;
  }
}

export {};
