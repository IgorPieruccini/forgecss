import { Component } from "./myComponent"

export const App = () => {
  return <div>
    <div className="mb-2">
      <div className="mt-2 someOtherClass flex"></div>
      <div className="ml-4">
        <Component />
        <div className="m-16 flex justify-to-center"></div>
      </div>
    </div>
  </div>
}
