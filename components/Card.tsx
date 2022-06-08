import React from "react";

import { Card, Grid, SvgIcon, Typography } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

import { blue } from "@mui/material/colors";

import Clubs from "../public/images/club.svg";
import Diamonds from "../public/images/diamond.svg";
import Hearts from "../public/images/heart.svg";
import Spades from "../public/images/spade.svg";
import { CardFamilies } from "../app/store/types";

const Icon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    {props.children}
  </SvgIcon>
)

const SVG: React.FC<{family: CardFamilies}> = (props) => {
    switch (props.family) {
        case "Clubs":
            return <Clubs />;
            
        case "Diamonds":
            return <Diamonds style={{ color: 'red' }} />;
            
        case "Hearts":
            return <Hearts style={{ color: 'red' }} />;
            
        case "Spades":
            return <Spades />;
    
        default:
            return null;
    }
}

function MainCard(props: { number: string | number, family: CardFamilies, onClick?: () => void, isSelected?: boolean}) {
    return (
        <Card sx={theme => ({height: '100%', minWidth: theme.spacing(7)})}>
            <Grid
                container
                direction="column"
                spacing={1}
                sx={theme => ({padding: `${theme.spacing(1)} 0`})}
                onClick={props.onClick}
                style={{
                    borderWidth: '4px',
                    borderColor: props.isSelected ? blue.A100: "white",
                    borderStyle: 'solid',
                    cursor: typeof props.onClick === 'function' ? 'pointer': undefined,
                }}
            >
                <Grid item>
                <Typography
                    variant="h3"
                    textAlign="center"
                    sx={{userSelect: 'none', ...((props.family === "Diamonds" || props.family === "Hearts") && {color: "red"})}}
                >
                    {props.number}
                </Typography>
                </Grid>
                <Grid item sx={{textAlign: "center"}}>
                <Icon fontSize="large">
                    <SVG family={props.family} />
                </Icon>
                </Grid>
            </Grid>
        </Card>
    )
}

export default MainCard;