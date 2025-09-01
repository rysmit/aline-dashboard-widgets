
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const UIComponentDemo = () => {
  const [toggleStates, setToggleStates] = useState({
    toggle1: false,
    toggle2: true,
    toggle3: false,
    toggle4: true,
  });

  const [checkboxStates, setCheckboxStates] = useState({
    checkbox1: false,
    checkbox2: true,
    checkbox3: false,
    checkbox4: true,
  });

  return (
    <div className="bg-white rounded-lg border border-secondary-300 p-6 shadow-card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-6">UI Components Demo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Toggle Switches Section */}
        <div>
          <h4 className="text-md font-medium text-secondary-800 mb-4">Toggle Switches</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="toggle1"
                checked={toggleStates.toggle1}
                onCheckedChange={(checked) => 
                  setToggleStates(prev => ({ ...prev, toggle1: checked }))
                }
              />
              <Label htmlFor="toggle1" className="text-sm font-medium">
                Enable notifications
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="toggle2"
                checked={toggleStates.toggle2}
                onCheckedChange={(checked) => 
                  setToggleStates(prev => ({ ...prev, toggle2: checked }))
                }
              />
              <Label htmlFor="toggle2" className="text-sm font-medium">
                Auto-save enabled
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="toggle3"
                checked={toggleStates.toggle3}
                onCheckedChange={(checked) => 
                  setToggleStates(prev => ({ ...prev, toggle3: checked }))
                }
              />
              <Label htmlFor="toggle3" className="text-sm font-medium">
                Dark mode
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="toggle4"
                checked={toggleStates.toggle4}
                onCheckedChange={(checked) => 
                  setToggleStates(prev => ({ ...prev, toggle4: checked }))
                }
                disabled
              />
              <Label htmlFor="toggle4" className="text-sm font-medium text-secondary-500">
                Premium feature (disabled)
              </Label>
            </div>
          </div>
        </div>

        {/* Checkboxes Section */}
        <div>
          <h4 className="text-md font-medium text-secondary-800 mb-4">Checkboxes</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkbox1"
                checked={checkboxStates.checkbox1}
                onCheckedChange={(checked) => 
                  setCheckboxStates(prev => ({ ...prev, checkbox1: checked as boolean }))
                }
              />
              <Label htmlFor="checkbox1" className="text-sm font-medium">
                I agree to the terms and conditions
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkbox2"
                checked={checkboxStates.checkbox2}
                onCheckedChange={(checked) => 
                  setCheckboxStates(prev => ({ ...prev, checkbox2: checked as boolean }))
                }
              />
              <Label htmlFor="checkbox2" className="text-sm font-medium">
                Subscribe to newsletter
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkbox3"
                checked={checkboxStates.checkbox3}
                onCheckedChange={(checked) => 
                  setCheckboxStates(prev => ({ ...prev, checkbox3: checked as boolean }))
                }
              />
              <Label htmlFor="checkbox3" className="text-sm font-medium">
                Enable two-factor authentication
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="checkbox4"
                checked={checkboxStates.checkbox4}
                onCheckedChange={(checked) => 
                  setCheckboxStates(prev => ({ ...prev, checkbox4: checked as boolean }))
                }
                disabled
              />
              <Label htmlFor="checkbox4" className="text-sm font-medium text-secondary-500">
                Advanced settings (disabled)
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Current States Display */}
      <div className="mt-8 pt-6 border-t border-secondary-200">
        <h4 className="text-md font-medium text-secondary-800 mb-3">Current States</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-secondary-700 mb-2">Toggle States:</p>
            <pre className="bg-secondary-50 p-2 rounded text-xs">
              {JSON.stringify(toggleStates, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium text-secondary-700 mb-2">Checkbox States:</p>
            <pre className="bg-secondary-50 p-2 rounded text-xs">
              {JSON.stringify(checkboxStates, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
