import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JSX, useEffect, useState } from "react";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";
import { HexColorPicker } from "react-colorful";

const base = "http://192.168.1.44:5000";

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
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Pironman</CardTitle>
      </CardHeader>
      <CardContent>
        <p>RGB color</p>
        <ColorPicker />
      </CardContent>
      <CardContent>
        <p>RGB style</p>
        <div className="grid grid-cols-2 items-center gap-2 mt-2">
          {[
            { name: "Breath", icon: "spa", value: "breath" },
            { name: "Colorful", icon: "palette", value: "colorful" },
            { name: "Flow", icon: "airwave", value: "flow" },
            { name: "Raise up", icon: "moving", value: "raise_up" },
          ].map((choice) => (
            <Button
              key={choice.name}
              onClick={async () => {
                setLoading("style");
                await fetch(`${base}/set-rgb-style?value=${choice.value}`);
                setLoading(null);
              }}
              variant="outline"
              className="flex-1"
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
      <CardContent>
        <p>Manual override</p>
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
      </CardContent>
    </Card>
  );
}

function HexLights() {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Hex Lights</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Color</p>
        <div className="flex flex-row items-center gap-2 mt-2">
          <Input placeholder="#000000" />
          <Button onClick={ipcHandle}>Set</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AmbientLighting() {
  const ipcHandle = (): void => window.electron.ipcRenderer.send("ping");

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Ambient Lighting</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Color</p>
        <div className="flex flex-row items-center gap-2 mt-2">
          <Input placeholder="#000000" />
          <Button onClick={ipcHandle}>Set</Button>
        </div>
      </CardContent>
    </Card>
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
    <Card
      className={
        " rounded-full text-center w-[350px]" +
        (online ? " bg-green-900" : " bg-red-900")
      }
    >
      <CardHeader className="py-2 flex-row justify-center gap-3 items-center">
        <span className="icon">wifi</span>
        <p style={{ marginTop: 0 }}>
          {online ? "Connected to " : "Can't connect to "}
          {base.replace("http://", "")}
        </p>
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
        className="fixed top-0 w-full left-0 z-10 backdrop-blur-lg h-[30px]"
      />

      <Status />

      <h1 className="text-center mt-7 mb-3 text-3xl font-black">Functions</h1>
      <LockOnLeave />

      <h1 className="text-center mt-7 mb-3 text-3xl font-black">Components</h1>
      <Pironman />
      <HexLights />
      <AmbientLighting />
    </div>
  );
}

export default App;

