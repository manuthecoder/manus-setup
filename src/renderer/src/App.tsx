import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JSX, useEffect, useState } from "react";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { HexColorPicker } from "react-colorful";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Drawer,
} from "./components/ui/drawer";

const base = "http://192.168.68.59:5000";

function CheckboxGroup({
  label,
  checked = false,
  setChecked = () => {},
}: {
  label: string;
  checked?: boolean;
  setChecked?: any;
}) {
  return (
    <div className="flex flex-row items-center gap-2 mt-2">
      <Checkbox checked={checked} onChange={setChecked} />
      <p>{label}</p>
    </div>
  );
}

function ColorPicker() {
  const [color, setColor] = useState<string | "">("");

  // debounce the color change on change
  useEffect(() => {
    if (!color) return;
    const timeout = setTimeout(async () => {
      await fetch(`${base}/set-rgb-color?value=${color.replace("#", "")}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [color]);

  return (
    <HexColorPicker
      className="mt-2"
      style={{ width: "100%" }}
      color={color}
      onChange={setColor}
    />
  );
}

function Pironman() {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");
  const [loading, setLoading] = useState<string | null>(null);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-[350px] justify-start h-auto py-2"
        >
          <span className="icon">filter_drama</span>
          <span className="font-black">Server controls</span>
          <span className="icon ml-auto">arrow_forward_ios</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[calc(100vh-60px)] overflow-y-scroll p-4">
          <CardContent>
            <p>RGB color</p>
            <ColorPicker />
          </CardContent>
          <CardContent>
            <p>RGB style</p>
            <div className="flex items-center gap-2 mt-2">
              {[
                { name: "Breath", icon: "spa", value: "breath" },
                { name: "Colorful", icon: "palette", value: "colorful" },
                { name: "Flow", icon: "airwave", value: "flow" },
                { name: "Raise up", icon: "moving", value: "raise_up" },
                { name: "Leap", icon: "automation", value: "leap" },
              ].map((choice) => (
                <Button
                  key={choice.name}
                  onClick={async () => {
                    setLoading("style");
                    await fetch(`${base}/set-rgb-style?value=${choice.value}`);
                    setLoading(null);
                  }}
                  variant="outline"
                  className="flex-1 flex-col h-auto gap-0"
                  disabled={loading === "style"}
                >
                  <span className="icon">{choice.icon}</span>
                  {choice.name}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardContent>
            <p>Fan temperature</p>
            <div className="flex flex-row items-center gap-2 mt-2">
              <Input placeholder="120" />
              <Button onClick={ipcHandle}>Set</Button>
            </div>
          </CardContent>
          <CardContent>
            <p>Screen display duration</p>
            <div className="flex flex-row items-center gap-2 mt-2">
              <Input placeholder="15s" />
              <Button onClick={ipcHandle}>Set</Button>
            </div>
          </CardContent>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function HexLights() {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-[350px] justify-start h-auto py-2"
        >
          <span className="icon">hexagon</span>
          <span className="font-black">Hexagonal modules</span>
          <span className="icon ml-auto">arrow_forward_ios</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[calc(100vh-60px)] overflow-y-scroll p-4"></div>
      </DrawerContent>
    </Drawer>
  );
}

function AmbientLighting() {
  const [loading, setLoading] = useState<string | null>(null);

  const RGB_COMMANDS = {
    ON: "3301010000000000000000000000000000000033",
    OFF: "3301000000000000000000000000000000000032",

    //scenes
    SUNRISE: "3305040000000000000000000000000000000032",
    SUNSET: "3305040100000000000000000000000000000033",
    MOVIE: "3305040400000000000000000000000000000036",
    ROSE: "3305040500000000000000000000000000000037",
    FIRE: "3305040700000000000000000000000000000035",
    BLINKING: "330504080000000000000000000000000000003a",
    CANDLE: "330504090000000000000000000000000000003b",
    SNOW: "3305040f0000000000000000000000000000003d",
    RAINBOW: "3305041600000000000000000000000000000024",
  };

  const sendCommand = async (command: string) => {
    setLoading(command);
    await fetch(`${base}/ambient_lighting?value=${command}`);
    setLoading(null);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-[350px] justify-start h-auto py-2"
        >
          <span className="icon">light</span>
          <span className="font-black">Ambient lighting</span>
          <span className="icon ml-auto">arrow_forward_ios</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="max-h-[calc(100vh-60px)] overflow-y-scroll p-4 flex gap-2">
          <Button
            onClick={() => sendCommand(RGB_COMMANDS.ON)}
            disabled={loading === RGB_COMMANDS.ON}
            variant="outline"
            className="flex-1"
          >
            Turn on
          </Button>
          <Button
            onClick={() => sendCommand(RGB_COMMANDS.OFF)}
            disabled={loading === RGB_COMMANDS.OFF}
            variant="outline"
            className="flex-1"
          >
            Turn off
          </Button>
        </div>
        <div className="max-h-[calc(100vh-60px)] overflow-y-scroll p-4 flex flex-col gap-2">
          {[
            { name: "Sunrise", value: RGB_COMMANDS.SUNRISE },
            { name: "Sunset", value: RGB_COMMANDS.SUNSET },
            { name: "Movie", value: RGB_COMMANDS.MOVIE },
            { name: "Rose", value: RGB_COMMANDS.ROSE },
            { name: "Fire", value: RGB_COMMANDS.FIRE },
            { name: "Blinking", value: RGB_COMMANDS.BLINKING },
            { name: "Candle", value: RGB_COMMANDS.CANDLE },
            { name: "Snow", value: RGB_COMMANDS.SNOW },
            { name: "Rainbow", value: RGB_COMMANDS.RAINBOW },
          ].map((scene) => (
            <Button
              key={scene.name}
              onClick={() => sendCommand(scene.value)}
              disabled={loading === scene.value}
              variant="outline"
              className="flex-1"
            >
              {scene.name}
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function LockOnLeave() {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Lock on leave</CardTitle>
      </CardHeader>
      <CardContent>
        <CheckboxGroup label="Enabled" checked />
        <CheckboxGroup label="Mute this laptop's audio?" checked />
        <CheckboxGroup label="Turn off server lighting?" checked />
        <CheckboxGroup label="Turn off hexagon lighting?" checked />
        <CheckboxGroup label="Turn off ambient lighting?" checked />
      </CardContent>
    </Card>
  );
}

function Status() {
  const [online, setOnline] = useState<boolean>(false);

  const getStatus = async () => {
    try {
      const response = await fetch(`${base}`).then((res) => res.json());
      if (response.status === "ONLINE") {
        setOnline(true);
      }
    } catch (error) {
      console.error(error);
      setOnline(false);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      getStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={
        "rounded-sm text-center inline-flex text-xs px-1 ml-2 gap-2 flex-row items-center"
      }
    >
      <span
        className={
          "icon text-xs" + (online ? " text-green-900" : " text-red-900")
        }
        style={{ fontVariationSettings: `"wght" 300` }}
      >
        wifi
      </span>
      <p
        style={{ marginTop: 0 }}
        className={
          "font-medium" + (online ? " text-green-900" : " text-red-900")
        }
      >
        {online ? "Connected" : "Offline"}
      </p>
    </div>
  );
}

function ManualOverride() {
  const [loading, setLoading] = useState<string | null>(null);
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <p className="-mt-3">Manual override</p>
        <div className="flex flex-row items-center gap-2 mt-2">
          <Button
            onClick={async () => {
              setLoading("lock");
              await fetch(`${base}/lock_event?eventType=LOCK`);
              setLoading(null);
            }}
            variant="outline"
            className="flex-1"
            disabled={loading === "lock"}
          >
            Lock
          </Button>
          <Button
            onClick={async () => {
              setLoading("unlock");
              await fetch(`${base}/lock_event?eventType=UNLOCK`);
              setLoading(null);
            }}
            variant="outline"
            className="flex-1"
            disabled={loading === "unlock"}
          >
            Unlock
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

function App(): JSX.Element {
  return (
    <div
      className="p-16 flex flex-col gap-5"
      style={{ ["WebkitAppRegion" as any]: "no-drag" }}
    >
      <div
        style={{ ["WebkitAppRegion" as any]: "drag" }}
        className="fixed top-0 w-full left-0 z-10 flex items-center backdrop-blur-lg h-[30px]"
      >
        <Status />
      </div>

      <h1 className="text-center mt-7 mb-3 text-3xl font-black">Functions</h1>
      <ManualOverride />
      <LockOnLeave />

      <h1 className="text-center mt-7 mb-3 text-3xl font-black">Components</h1>
      <div className="flex flex-col gap-2">
        <Pironman />
        <AmbientLighting />
        <HexLights />
      </div>
    </div>
  );
}

export default App;

