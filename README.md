**NOTE: This plugin is in WIP state. While it should work in simple cases, there are still some work in progress to make it more stable.**

---

# homebridge-homesung

A [homebridge](https://github.com/nfarina/homebridge) plugin that allows you to control the Samsung Smart TV H and J series with HomeKit and Siri.

This plugin was made because the available ones offer the support for only the newer (2016+) models. Thanks to the reverse engineering work done by people in [this](https://github.com/Ape/samsungctl/issues/22) thread, the specifics of pairing protocol of H and J series were finally revealed.

## Installation

- Install homebridge - refer to their [README](https://github.com/nfarina/homebridge/blob/master/README.md) for further instructions.
- Install the plugin using: `npm install -g --unsafe-perm homebridge-homesung`
- Update your configuration file - see the `config-sample.json` for reference.

## Configuration

- Edit your configuration file from `~/.homebridge/config.json`
- Platform should be **SamsungTV**.
- Devices should be a list of the TV's to be controlled.

```
  "platforms": [
    {
      "platform": "SamsungTV",
      "devices": [
        {
          "name": "<name of the device>",
          "ip": "<ip of the device>",
          "identity": {
            "sessionId": "<id of the pairing session - obtained after pairing>",
            "aesKey": "<key of the pairing session - obtained after pairing>"
          },
          "power": {
            "name": "<name of the power switch>",
            "key": "<key to use in order to power off the TV if hdmi-cec is disabled>",
            "enableCEC": "<whether to use hdmi-cec as a power on/off method>",
          }
          "switches": [
            { "name": "Vol Down 5", "delay": 1000, "command": "5*KEY_VOLDOWN" },
            { "name": "Channel 12", "command": ["KEY_1", "KEY_2"] },
            { "name": "Play with sound", "command": ["5*KEY_VOLDOWN", "5*KEY_VOLUP"] },
            {
              "name": "Do something",
              "command": { "keys": "5*KEY_VOLDOWN", "delay": 2000 }
            },
            {
              "name": "Do more of something",
              "command": { "keys": ["KEY_1", "KEY_2"], "delay": 1000 }
            },
            {
              "name": "Launch Netflix",
              "command": [
                { "keys": "KEY_CONTENTS", "delay": 2000 },
                { "keys": ["3*KEY_LEFT", "KEY_ENTER"], "delay": 1000 }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Pairing

In order to obtain configuration info such as `identity` turn on the TV and run `homesung-pair <ip of the device>` from terminal.
The pairing code should be displayed on the TV screen. After typing the correct pin code in the terminal, all the required info should be printed.

If the tool reports that it couldn't establish the connection right after the TV was turned on, try waiting a couple of minutes till the networking interface of the device will be ready to accept http calls.

## Device settings

| Name             | Description                                                                                               |
| :--------------- | :-------------------------------------------------------------------------------------------------------- |
| name             | Name of the device in HomeKit.                                                                            |
| ip               | The IP address of the device.                                                                             |
| identity         | Pairing session id and key used to encrypt communication.                                                 |
| power (optional) | Power object that specifies the behaviour of powering on/off the TV. See [power](#Power) for a reference. |
| debug (optional) | If set to true, additional connection info will appear in the logs. The default value is false.           |

### Power

| Name       | Description                                                                                          |
| :--------- | :--------------------------------------------------------------------------------------------------- |
| name       | Name of the power switch in HomeKit. The default value is "Power TV".                                |
| enableCEC  | Whether to use hdmi-cec as a way to power off/on the device. The default value is false.             |
| key        | The key to be sent as a power off if hdmi-cec is disabled. The default value is KEY_POWEROFF.        |
| addressCEC | The hdmi-cec address of the device. The default value is 0 which should work with most of the cases. |

**NOTE: In order for HDMI-CEC to work, the server (e.g. rpi) must be connected to the TV via HDMI cable.**

## Switch settings

| Name             | Description                                                                                                  |
| :--------------- | :----------------------------------------------------------------------------------------------------------- |
| name             | Name of the switch in HomeKit.                                                                               |
| command          | Command to be sent to TV. See [commands](#Commands) as a syntax reference.                                   |
| delay (optional) | Time (in miliseconds) to wait **after** sending **each** of the keys to the TV. The default value is 500 ms. |

### Commands

The command can be:

- a single key e.g. `KEY_VOLUP` to imitate a key press.
- a key with the multiplier e.g. `5 * KEY_VOLUP` to imitate the key being pressed multiple times.
- an array of the above e.g. `[KEY_VOLUP, 5 * KEY_VOLDOWN]` to imitate the sequence of key presses.
- an object or an array of objects with the following properties:

| Name             | Description                                                                                                                                                                                         |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keys             | A single key with or without a multiplier, or an array of such.                                                                                                                                     |
| delay (optional) | Time (in miliseconds) to wait **after** sending **each** of the keys associated with the command to the TV. The default value is 500 ms. This option will override the one set as a switch setting. |

See the `config-sample.json` for examples.

## Known limitations

- Turning the TV is possible only using HDMI-CEC technology.
- The TV does not offer any feedback on the TV state so most of the switches are stateless.
- As for today this plugin was not heavily tested, while the happy path scenarios might work, it can still break in more complex scenarios.

## Work in progress

- Turning TV on via wol (if possible).
- Better error handling

## List of available keys

```
KEY_ENTER
KEY_MENU
KEY_UP
KEY_DOWN
KEY_LEFT
KEY_RIGHT
KEY_0
KEY_1
KEY_2
KEY_3
KEY_4
KEY_5
KEY_6
KEY_7
KEY_8
KEY_9
KEY_11
KEY_12
KEY_VOLUP
KEY_VOLDOWN
KEY_MUTE
KEY_CHDOWN
KEY_CHUP
KEY_PRECH
KEY_GREEN
KEY_YELLOW
KEY_CYAN
KEY_ADDDEL
KEY_SOURCE
KEY_INFO
KEY_PIP_ONOFF
KEY_PIP_SWAP
KEY_PLUS100
KEY_CAPTION
KEY_PMODE
KEY_TTX_MIX
KEY_TV
KEY_PICTURE_SIZE
KEY_AD
KEY_PIP_SIZE
KEY_MAGIC_CHANNEL
KEY_PIP_SCAN
KEY_PIP_CHUP
KEY_PIP_CHDOWN
KEY_DEVICE_CONNECT
KEY_HELP
KEY_ANTENA
KEY_CONVERGENCE
KEY_AUTO_PROGRAM
KEY_FACTORY
KEY_3SPEED
KEY_RSURF
KEY_ASPECT
KEY_TOPMENU
KEY_GAME
KEY_QUICK_REPLAY
KEY_STILL_PICTURE
KEY_DTV
KEY_FAVCH
KEY_REWIND
KEY_STOP
KEY_PLAY
KEY_FF
KEY_REC
KEY_PAUSE
KEY_TOOLS
KEY_INSTANT_REPLAY
KEY_LINK
KEY_FF_
KEY_GUIDE
KEY_REWIND_
KEY_ANGLE
KEY_RESERVED1
KEY_ZOOM1
KEY_PROGRAM
KEY_BOOKMARK
KEY_DISC_MENU
KEY_PRINT
KEY_RETURN
KEY_SUB_TITLE
KEY_CLEAR
KEY_VCHIP
KEY_REPEAT
KEY_DOOR
KEY_OPEN
KEY_WHEEL_LEFT
KEY_POWER
KEY_SLEEP
KEY_DMA
KEY_TURBO
KEY_FM_RADIO
KEY_DVR_MENU
KEY_MTS
KEY_PCMODE
KEY_TTX_SUBFACE
KEY_CH_LIST
KEY_RED
KEY_DNIe
KEY_SRS
KEY_CONVERT_AUDIO_MAINSUB
KEY_MDC
KEY_SEFFECT
KEY_DVR
KEY_DTV_SIGNAL
KEY_LIVE
KEY_PERPECT_FOCUS
KEY_HOME
KEY_ESAVING
KEY_WHEEL_RIGHT
KEY_CONTENTS
KEY_VCR_MODE
KEY_CATV_MODE
KEY_DSS_MODE
KEY_TV_MODE
KEY_DVD_MODE
KEY_STB_MODE
KEY_CALLER_ID
KEY_SCALE
KEY_ZOOM_MOVE
KEY_CLOCK_DISPLAY
KEY_AV1
KEY_AV2
KEY_AV3
KEY_SVIDEO1
KEY_COMPONENT1
KEY_SETUP_CLOCK_TIMER
KEY_COMPONENT2
KEY_MAGIC_BRIGHT
KEY_DVI
KEY_HDMI
KEY_HDMI1
KEY_HDMI2
KEY_HDMI3
KEY_HDMI4
KEY_W_LINK
KEY_DTV_LINK
KEY_APP_LIST
KEY_BACK_MHP
KEY_ALT_MHP
KEY_DNSe
KEY_RSS
KEY_ENTERTAINMENT
KEY_ID_INPUT
KEY_ID_SETUP
KEY_ANYNET
KEY_POWEROFF
KEY_POWERON
KEY_ANYVIEW
KEY_MS
KEY_MORE
KEY_PANNEL_POWER
KEY_PANNEL_CHUP
KEY_PANNEL_CHDOWN
KEY_PANNEL_VOLUP
KEY_PANNEL_VOLDOW
KEY_PANNEL_ENTER
KEY_PANNEL_MENU
KEY_PANNEL_SOURCE
KEY_SVIDEO2
KEY_SVIDEO3
KEY_ZOOM2
KEY_PANORAMA
KEY_4_3
KEY_16_9
KEY_DYNAMIC
KEY_STANDARD
KEY_MOVIE1
KEY_CUSTOM
KEY_AUTO_ARC_RESET
KEY_AUTO_ARC_LNA_ON
KEY_AUTO_ARC_LNA_OFF
KEY_AUTO_ARC_ANYNET_MODE_OK
KEY_AUTO_ARC_ANYNET_AUTO_START
KEY_AUTO_FORMAT
KEY_DNET
KEY_AUTO_ARC_CAPTION_ON
KEY_AUTO_ARC_CAPTION_OFF
KEY_AUTO_ARC_PIP_DOUBLE
KEY_AUTO_ARC_PIP_LARGE
KEY_AUTO_ARC_PIP_SMALL
KEY_AUTO_ARC_PIP_WIDE
KEY_AUTO_ARC_PIP_LEFT_TOP
KEY_AUTO_ARC_PIP_RIGHT_TOP
KEY_AUTO_ARC_PIP_LEFT_BOTTOM
KEY_AUTO_ARC_PIP_RIGHT_BOTTOM
KEY_AUTO_ARC_PIP_CH_CHANGE
KEY_AUTO_ARC_AUTOCOLOR_SUCCESS
KEY_AUTO_ARC_AUTOCOLOR_FAIL
KEY_AUTO_ARC_C_FORCE_AGING
KEY_AUTO_ARC_USBJACK_INSPECT
KEY_AUTO_ARC_JACK_IDENT
KEY_NINE_SEPERATE
KEY_ZOOM_IN
KEY_ZOOM_OUT
KEY_MIC
KEY_AUTO_ARC_CAPTION_KOR
KEY_AUTO_ARC_CAPTION_ENG
KEY_AUTO_ARC_PIP_SOURCE_CHANGE
KEY_AUTO_ARC_ANTENNA_AIR
KEY_AUTO_ARC_ANTENNA_CABLE
KEY_AUTO_ARC_ANTENNA_SATELLITE
KEY_EXT1
KEY_EXT2
KEY_EXT3
KEY_EXT4
KEY_EXT5
KEY_EXT6
KEY_EXT7
KEY_EXT8
KEY_EXT9
KEY_EXT10
KEY_EXT11
KEY_EXT12
KEY_EXT13
KEY_EXT14
KEY_EXT15
KEY_EXT16
KEY_EXT17
KEY_EXT18
KEY_EXT19
KEY_EXT20
KEY_EXT21
KEY_EXT22
KEY_EXT23
KEY_EXT24
KEY_EXT25
KEY_EXT26
KEY_EXT27
KEY_EXT28
KEY_EXT29
KEY_EXT30
KEY_EXT31
KEY_EXT32
KEY_EXT33
KEY_EXT34
KEY_EXT35
KEY_EXT36
KEY_EXT37
KEY_EXT38
KEY_EXT39
KEY_EXT40
KEY_EXT41
```
