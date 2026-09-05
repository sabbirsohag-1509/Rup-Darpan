import { useEffect } from "react";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const BubbleEffect = () => {
    useEffect(() => {
        let isMounted = true;

        const initParticles = async () => {
            try {
                await loadSlim(tsParticles);

                if (!isMounted) return;

                await tsParticles.load({
                    id: "bubble-particles",

                    options: {
                        fullScreen: {
                            enable: false,
                        },

                        fpsLimit: 60,

                        detectRetina: true,

                        background: {
                            color: {
                                value: "transparent",
                            },
                        },

                        particles: {
                            number: {
                                value: 130,

                                density: {
                                    enable: true,
                                    area: 1100,
                                },
                            },

                            color: {
                                value: [
                                    "#ffffff",
                                    "#c084fc",
                                    "#818cf8",
                                    "#38bdf8",
                                    "#a78bfa",
                                ],
                            },

                            shape: {
                                type: "circle",
                            },

                            size: {
                                value: {
                                    min: 0.5,
                                    max: 3,
                                },

                                animation: {
                                    enable: true,
                                    speed: 1.5,
                                    minimumValue: 0.3,
                                    sync: false,
                                },
                            },

                            opacity: {
                                value: {
                                    min: 0.15,
                                    max: 0.75,
                                },

                                animation: {
                                    enable: true,
                                    speed: 0.5,
                                    minimumValue: 0.1,
                                    sync: false,
                                },
                            },

                            move: {
                                enable: true,

                                direction: "none",

                                speed: {
                                    min: 0.08,
                                    max: 0.35,
                                },

                                random: true,

                                straight: false,

                                outModes: {
                                    default: "out",
                                },
                            },

                            links: {
                                enable: true,

                                distance: 120,

                                color: "#8b5cf6",

                                opacity: 0.08,

                                width: 0.5,
                            },
                        },

                        interactivity: {
                            detectsOn: "window",

                            events: {
                                onHover: {
                                    enable: false,
                                },

                                onClick: {
                                    enable: false,
                                },

                                resize: {
                                    enable: true,
                                },
                            },
                        },

                        emitters: {
                            direction: "none",

                            rate: {
                                delay: 2,
                                quantity: 1,
                            },

                            size: {
                                width: 100,
                                height: 100,
                            },

                            position: {
                                x: 50,
                                y: 50,
                            },
                        },
                    },
                });
            } catch (error) {
                console.error("Milky Way particle initialization failed:", error);
            }
        };

        initParticles();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div
            id="bubble-particles"
            className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
        />
    );
};

export default BubbleEffect;