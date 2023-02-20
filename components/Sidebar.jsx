import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';

const Sidebar = () => {
    return (
        <Nav className="flex-column">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">Mate</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <Link className="dropdown-item" href="/page1">
                    Page 1
                </Link>
                <Link className="dropdown-item" href="/page2">
                    Page 2
                </Link>
                <Link className="dropdown-item" href="/page3">
                    Page 3
                </Link>
            </NavDropdown>
            <Nav.Link href="/">Te</Nav.Link>
        </Nav>
    );
};

export default Sidebar;