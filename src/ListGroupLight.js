import React from 'react';
import PropTypes from 'prop-types';
import RBListGroup from 'react-bootstrap/ListGroup';

const propTypes = {
  items: PropTypes.array,
};

export const ListGroup = ({ items = false }) => {
  const $ListGroup = React.forwardRef((props, ref) => {
    const propsPlus = {};
    if (props.items && items) {
      propsPlus.children = items(props.items);
    }
    return <RBListGroup ref={ref} {...props} {...propsPlus} />;
  });

  $ListGroup.propTypes = propTypes;
  $ListGroup.Item = RBListGroup.Item;
  $ListGroup.displayName = 'ListGroupPlus';
  return $ListGroup;
};
export const items = (array) => {
  return array.map((a) => {
    const props = { ...a };
    props.children = a.value;
    props.key = a.value;
    return <RBListGroup.Item {...props} />;
  });
};
