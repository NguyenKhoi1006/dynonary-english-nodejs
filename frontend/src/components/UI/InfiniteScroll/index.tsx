import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

function InfiniteScroll(props: any) {
  const { className, onTouchAnchor, threshold } = props;
  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          onTouchAnchor();
        }
      },
      { threshold },
    ),
  );
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <div className={className} ref={(el) => setElement(el)}>
      {props.children}
    </div>
  );
}

InfiniteScroll.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  onTouchAnchor: PropTypes.func,
  threshold: PropTypes.number,
};

InfiniteScroll.defaultProps = {
  className: '',
  onTouchAnchor: function () {},
  threshold: 0.5,
};

export default InfiniteScroll;
