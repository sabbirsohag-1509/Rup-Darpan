import { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const BubbleEffect = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        loadSlim();
        setInit(true);
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="bubble-particles"
            options={{
                fullScreen: {
                    enable: true,
                    zIndex: -1,
                },

                particles: {
                    number: {
                        value: 40,
                    },

                    shape: {
                        type: "circle",
                    },

                    size: {
                        value: {
                            min: 5,
                            max: 25,
                        },
                    },

                    opacity: {
                        value: 0.25,
                    },

                    move: {
                        enable: true,
                        direction: "top",
                        speed: 1,
                    },
                },
            }}
        />
    );
};

export default BubbleEffect;