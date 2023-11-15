// constants.ts
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string
const DID_API_KEY = import.meta.env.VITE_DID_API_KEY as string
export const constants = {
  OPENAI_API_KEY,
  DID_API_KEY,
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions', // OpenAI API endpoint
  DID_API_URL: 'https://api.d-id.com', // D-ID API base URL
  SOURCE_URL: 'https://raw.githubusercontent.com/jjmlovesgit/D-id_Streaming_Chatgpt/main/oracle_pic.jpg', //https://replicate.delivery/pbxt/lITb95hPuFJzNt4Oy6B5E67q1lN6Iw1kBA8dtGmoSWpkvIeIA/out.png', // URL to the image used for the avatar
  DRIVER_URL: 'bank://fun/', // Driver URL for D-ID
  STREAMING_CONFIG: {
    // Configuration settings for D-ID streaming
    fluent: true,
    pad_audio: 0,
    driver_expressions: {
      expressions: [{ expression: 'neutral', start_frame: 0, intensity: 0 }],
      transition_frames: 0,
    },
    align_driver: true,
    align_expand_factor: 0,
    auto_match: true,
    motion_factor: 0,
    normalization_factor: 0,
    sharpen: true,
    stitch: true,
    result_format: 'mp4',
  },
}

/***
 * bank://nostalgia	Gentle and slow movements
 * bank://fun	Funky movements with funny facial expressions
 * bank://dance	Dancing heads movements
 * bank://classics	Singing movements | make sure to set "mute": false
 * bank://subtle	Subtle movements | works best with multiple faces that are close to each other in a single image
 * bank://stitch	Works best when "stitch": true
 */
