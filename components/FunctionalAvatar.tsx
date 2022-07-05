import { Avatar, Badge } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import usePrevious from '../app/hooks/usePrevious';
import OnlineBadge from './OnlineBadge';

export type FunctionalAvatarProps = {
    isOnline?: boolean,
    sx: Object,
    name: string,
    cardCount: number
};

const AvatarWithBadge: React.FC<FunctionalAvatarProps> = props => {
    const [isNew, setIsNew] = useState(false);
    const prevCardCount = usePrevious(props.cardCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const cardCountFormatted = useMemo(() => `${props.cardCount || '?'} ${isNew ? 'left!': ''}`, [isNew]);

    useEffect(() => {
        if (prevCardCount === props.cardCount) {
            return;
        }

        setTimeout(() => {
            setIsNew(false);
        }, 2000);

        setIsNew(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.cardCount]);
    return (
        <Badge
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            badgeContent={props.cardCount && cardCountFormatted}
            sx={{whiteSpace: 'nowrap'}}
            color="primary"
        >
            <Avatar sx={props.sx}>{props.name.substring(0,2)}</Avatar>
        </Badge>
    );
}

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