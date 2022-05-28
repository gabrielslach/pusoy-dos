import React from "react";

import { Card, Grid, SvgIcon, Typography } from '@mui/material';
import { SvgIconProps } from '@mui/material/SvgIcon';

// import { ReactComponent as Spades } from '../public/images/spade.svg';
import { blue } from "@mui/material/colors";

const Icon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    {props.children}
  </SvgIcon>
)

function MainCard(props: { number: string | number, family: string, onClick?: () => void, isSelected?: boolean}) {
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
                <Typography variant="h3" textAlign="center" sx={{userSelect: 'none'}}>{props.number}</Typography>
                </Grid>
                <Grid item sx={{textAlign: "center"}}>
                <Icon fontSize="large">
                    {/* <Spades /> */}
                </Icon>
                </Grid>
            </Grid>
        </Card>
    )
}

export default MainCard;