import { ComponentInDir } from "./components/componentInDir"

export const OtherComponent = () => {
  return <div>
    <div className="flex p-2">
      <div className="pt-2 someOtherClass flex"></div>
      <div className="pb-4">
        <div className="pr-16 align-to-center"></div>
        <ComponentInDir />
      </div>
    </div>
  </div>
}

