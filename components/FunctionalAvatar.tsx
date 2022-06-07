import { Avatar, Badge } from '@mui/material';
import React from 'react';
import StyledBadge from './OnlineBadge';

export type FunctionalAvatarProps = {
    isOnline: boolean,
    sx: Object,
    name: string
};

const FunctionalAvatar: React.FC<FunctionalAvatarProps> = props => {
    switch (props.isOnline) {
        case true:
            return (
                <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <Avatar sx={props.sx}>{props.name.substring(0,2)}</Avatar>
                </StyledBadge>
            )
            break;
        
        case false:
        default:
            return (
                <Avatar sx={props.sx}>{props.name.substring(0,2)}</Avatar>
            )
            break;
    }
};

export default FunctionalAvatar;