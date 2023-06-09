import { useState, useRef } from 'react'
import type { MqttClient } from 'mqtt'
import useMqtt from '../lib/useMqtt'
import { handlerPayload } from '../lib/useMqtt'
import {
  Box,
  Button,
  TextField,
  Stack,
  Container,
  Typography,
} from '@mui/material'

export default function Home() {
  const [pressure, setPressure] = useState('')
  const [temp, setTemp] = useState('')
  const [altitude, setAltitude] = useState('')
  const [numTaps, setNumTaps] = useState('')
  const [minPressureInput, setMinPressureInput] = useState(99000)
  const [maxPressureInput, setMaxPressureInput] = useState(99500)

  const incommingMessageHandlers = useRef([
    {
      topic: '/pressure',
      handler: ({ payload }: handlerPayload) => {
        setPressure(payload)
      },
    },
    {
      topic: '/temp',
      handler: ({ payload }: handlerPayload) => {
        setTemp(payload)
      },
    },
    {
      topic: '/altitude',
      handler: ({ payload }: handlerPayload) => {
        setAltitude(payload)
      },
    },
    {
      topic: '/tapDetected',
      handler: ({ payload }: handlerPayload) => {
        setNumTaps(payload)
      },
    },
  ])

  const mqttClientRef = useRef<MqttClient | null>(null)
  const setMqttClient = (client: MqttClient) => {
    mqttClientRef.current = client
  }
  useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URI,
    options: {
      // username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      // password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
    },
    topicHandlers: incommingMessageHandlers.current,
    onConnectedHandler: (client) => setMqttClient(client),
  })

  const publishMessages = (client: any) => {
    if (!client) {
      console.log('(publishMessages) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/hello', 'Just saying hi from the client side :)')
  }

  const toggleLed = (client: any) => {
    if (!client) {
      console.log('(toggleLed) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/toggleLed', 'true')
  }

  const inhale = (client: any) => {
    if (!client) {
      console.log('(inhale) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/inhale', 'true')
  }
  const exhale = (client: any) => {
    if (!client) {
      console.log('(exhale) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/exhale', 'true')
  }

  const holdBreath = (client: any) => {
    if (!client) {
      console.log('(holdBreath) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/holdBreath', 'true')
  }

  const breatheSteady = (client: any) => {
    if (!client) {
      console.log('(breatheSteady) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/breatheSteady', 'true')
  }

  const mainLedOn = (client: any) => {
    if (!client) {
      console.log('(mainLedOn) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/mainLedOn', 'true')
  }

  const mainLedOff = (client: any) => {
    if (!client) {
      console.log('(mainLedOff) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/mainLedOff', 'true')
  }

  const sendMinPressure = (client: any) => {
    if (!client) {
      console.log('(sendMinPressure) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/setMinPressure', minPressureInput)
  }

  const sendMaxPressure = (client: any) => {
    if (!client) {
      console.log('(sendMaxPressure) Cannot publish, mqttClient: ', client)
      return
    }

    client.publish('/setMaxPressure', maxPressureInput)
  }

  return (
    <Container>
      <Box my={6}>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">Cur Pressure:</Typography>
          <Typography variant="h6">{pressure} PA</Typography>
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">Cur Temp:</Typography>
          <Typography variant="h6">
            {temp} <sup>*</sup>C
          </Typography>
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">Cur Altitude:</Typography>
          <Typography variant="h6">{altitude} m</Typography>
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <Typography variant="h4">Num Taps:</Typography>
          <Typography variant="h6">{numTaps}</Typography>
        </Stack>
        <Box my={4}>
          <Stack my={2} direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              onClick={() => publishMessages(mqttClientRef.current)}
            >
              Say Hello
            </Button>
            <Button
              variant="contained"
              onClick={() => toggleLed(mqttClientRef.current)}
            >
              Toggle LED
            </Button>
            <Button
              variant="contained"
              onMouseDown={() => inhale(mqttClientRef.current)}
              onMouseUp={() => holdBreath(mqttClientRef.current)}
            >
              Inhale
            </Button>
            <Button
              variant="contained"
              onMouseDown={() => exhale(mqttClientRef.current)}
              onMouseUp={() => holdBreath(mqttClientRef.current)}
            >
              Exhale
            </Button>
            <Button
              variant="contained"
              onClick={() => breatheSteady(mqttClientRef.current)}
            >
              Breathe Steady
            </Button>
            <Button
              variant="contained"
              onClick={() => mainLedOn(mqttClientRef.current)}
            >
              Main LED On
            </Button>
            <Button
              variant="contained"
              onClick={() => mainLedOff(mqttClientRef.current)}
            >
              Main LED Off
            </Button>
          </Stack>
        </Box>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Set Min Pressure"
            size="small"
            variant="filled"
            value={minPressureInput}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              // @ts-ignore
              setMinPressureInput(event.target.value)
            }}
          />
          <Button
            variant="contained"
            onClick={() => sendMinPressure(mqttClientRef.current)}
          >
            Update
          </Button>
        </Stack>
        <Stack my={2} direction="row" spacing={2} alignItems="center">
          <TextField
            label="Set Max Pressure"
            variant="filled"
            value={maxPressureInput}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              // @ts-ignore
              setMaxPressureInput(event.target.value)
            }}
          />
          <Button
            variant="contained"
            onClick={() => sendMaxPressure(mqttClientRef.current)}
          >
            Update
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
