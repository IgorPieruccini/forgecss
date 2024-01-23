import { ComponentInDir } from "./components"

export const OtherComponent = () => {
  return <div>
    <div className="flex m-4">
      <div className="mt-2"></div>
      <ComponentInDir />
    </div>
  </div>
}

