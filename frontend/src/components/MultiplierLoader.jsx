import { useSpring, animated } from "@react-spring/web";

const MultiplierLoader = ({ multiplier, duration }) => {
  const countAnimation = useSpring({
    number: multiplier,
    from: { number: 0 },
    config: {
      duration: duration,
    },
  });

  return (
    <animated.span>
      {countAnimation.number.to((val) => `${Math.floor(val)}x`)}
    </animated.span>
  );
};

export default MultiplierLoader;
