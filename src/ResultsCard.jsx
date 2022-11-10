import { countIfFailure, getMaxY, montecarloApprox, rectanglesApprox, trapesApprox } from "./utils";
import * as math from 'mathjs';
import { HorizontalGridLines, LineSeries, makeWidthFlexible, MarkSeries, VerticalGridLines, VerticalRectSeries, XAxis, XYPlot, YAxis } from "react-vis";
import { Typography } from "@material-ui/core";
import { MathJax } from "better-react-mathjax";

export const Methods = {
  MONTECARLO: {key: 'MONTECARLO', nombre: 'Monte Carlo', title: 'Método de Monte Carlo'},
  RECTANGLES: {key: 'RECTANGLES', nombre: 'Rectángulos', title: 'Método de los Rectángulos'},
  TRAPE: {key: 'TRAPE', nombre: 'Trapecios', title: 'Método de los Trapecios'},
};

const FlexibleXYPlot = makeWidthFlexible(XYPlot);

export function ResultsCard({
  method = Methods.MONTECARLO.key,
  f = "x",
  a = 0,
  b = 2,
  n = 20,
  data = [],
  randomPoints = [],
  texExpression = '',
}) {

  const maxY = getMaxY(data);
  const successPoints = countIfFailure(randomPoints, false);
  const failedPoints = randomPoints.length - successPoints;
  const montecarloValue = montecarloApprox(randomPoints, b, a, maxY);
  const rectangles = rectanglesApprox(f, a, b, n);
  const trapes = trapesApprox(f, a, b, n);

  function rectanglesValue(rectangles) {
    return rectangles.reduce((area, rectangle) => area + (rectangle.x - rectangle.x0) * rectangle.y, 0);
  }

  function trapesValue(trapes) {
    return trapes.reduce((area, trape) => area + (trape.x - trape.x0) * trape.y, 0);
  }

  return (
    <>
      <FlexibleXYPlot height={600}>
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <LineSeries data={data}/>
        {method === Methods.MONTECARLO.key ? (
          <MarkSeries
            colorType='literal'
            stroke={'black'}
            data={randomPoints}
            animation={"noWobble"}
          />
        ) : undefined }
        {method === Methods.RECTANGLES.key ? (
          <VerticalRectSeries
            colorType='literal'
            opacity={0.5}
            stroke={'black'}
            data={rectangles}
            animation={"noWobble"}
          />
        ) : undefined }
        {method === Methods.TRAPE.key ? (
          <VerticalRectSeries
            colorType='literal'
            opacity={0.5}
            stroke={'black'}
            data={trapes}
            animation={"noWobble"}
          />
        ) : undefined }
      </FlexibleXYPlot>
      <Typography style={{textAlign: 'center'}}>
        {method === Methods.MONTECARLO.key && `Aciertos positivos ${successPoints}   -    Aciertos negativos ${failedPoints}`}
      </Typography>
      <MathJax dynamic>
        {method === Methods.MONTECARLO.key ? `$$
          \\text{Área} =
          \\int_{${a}}^{${b}} ${texExpression}dx
          \\approx
          \\frac{${successPoints} - ${failedPoints}}{${randomPoints.length}}
          \\times ${math.round(maxY, 2)}
          \\times (${b} ${a < 0 ? `+ ${math.abs(a)}` : `- ${a}`})
          \\approx ${math.round(montecarloValue, 4)}
        $$` :
        `$$
          \\text{Área} =
          \\int_{${a}}^{${b}} ${texExpression}dx
          \\approx
          \\sum_{i=1}^{${n}} f(c_i)\\Delta x
          \\approx ${math.round(rectanglesValue(rectangles), 4)}
        $$`}
      </MathJax>
      {/* <MathJax dynamic>
        {method === Methods.MONTECARLO.key ? `$$
          \\text{Área} =
          \\int_{${a}}^{${b}} ${texExpression}dx
          \\approx
          \\frac{${successPoints}}{${randomPoints.length}}
          \\times (${b} ${a < 0 ? `+ ${math.abs(a)}` : `- ${a}`})
          \\times ${math.round(maxY, 2)}
          \\approx ${math.round(montecarloValue, 4)}
        $$` : <></> }
        {method === Methods.RECTANGLES.key ?
        `$$
          \\text{Área} =
          \\int_{${a}}^{${b}} ${texExpression}dx
          \\approx
          \\sum_{i=1}^{${n}} f(c_i)\\Delta x
          \\approx ${math.round(rectanglesValue(rectangles), 4)}
        $$` : <></> }
        {method === Methods.TRAPE.key ?
        `$$
          \\text{Área} =
          \\int_{${a}}^{${b}} ${texExpression}dx
          \\approx
          \\sum_{i=1}^{${n}} f(c_i)\\Delta x
          \\approx ${math.round(trapesValue(trapes), 4)}
        $$` : <></> }
      </MathJax> */}
    </>
  )
}
