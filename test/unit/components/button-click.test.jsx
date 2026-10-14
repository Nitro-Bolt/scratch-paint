/* eslint-env jest */
import React from 'react'; // eslint-disable-line no-unused-vars
import TestRenderer from 'react-test-renderer';
import Button from '../../../src/components/button/button.jsx'; // eslint-disable-line no-unused-vars, max-len

describe('Button', () => {
    test('triggers callback when clicked', () => {
        const onClick = jest.fn();
        const component = TestRenderer.create(
            <Button onClick={onClick}>
                {'Button'}
            </Button>
        );
        component.root.findByProps({role: 'button'}).props.onClick();
        expect(onClick).toHaveBeenCalled();
    });
});
