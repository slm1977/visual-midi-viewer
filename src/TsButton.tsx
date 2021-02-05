import React, { MouseEventHandler } from 'react'
import {Button} from 'reactstrap';

type Props = {
  onClick: MouseEventHandler,
  text: string,
}

const TsButton = ({ onClick, text }: Props) => (
  <Button onClick={onClick}>
    {text}
  </Button>
)

export default TsButton