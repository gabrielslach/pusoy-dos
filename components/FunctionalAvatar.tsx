import { Avatar, Badge } from '@mui/material';
import React from 'react';
import OnlineBadge from './OnlineBadge';

export type FunctionalAvatarProps = {
    isOnline?: boolean,
    sx: Object,
    name: string,
    cardCount: number
};

const AvatarWithBadge: React.FC<FunctionalAvatarProps> = props => (
    <Badge
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        badgeContent={props.cardCount}
        color="primary"
    >
        <Avatar sx={props.sx}>{props.name.substring(0,2)}</Avatar>
    </Badge>
)

const FunctionalAvatar: React.FC<FunctionalAvatarProps> = props => {
    switch (props.isOnline) {
        case true:
            return (
                <OnlineBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                >
                    <AvatarWithBadge sx={props.sx} name={props.name} cardCount={props.cardCount} />
                </OnlineBadge>
            )
            break;
        
        case false:
        default:
            return (
                <AvatarWithBadge sx={props.sx} name={props.name} cardCount={props.cardCount} />
            )
            break;
    }
};

export default FunctionalAvatar;