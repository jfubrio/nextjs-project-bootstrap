"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import jsPDF from 'jspdf';
import SignatureCanvas from 'react-signature-canvas';

interface FormData {
  nombreCompleto: string;
  edad: string;
  sexo: string;
  telefono: string;
  correo: string;
  alergiaAnestesicos: boolean;
  alergiaMedicamentos: boolean;
  alergiaMedicamentosEspecificar: string;
  enfermedadesDermatologicas: boolean;
  procedimientosEsteticos: boolean;
  cicatrizacion: string;
  isotretinoina: boolean;
  tabaquismo: boolean;
  alcohol: boolean;
  sueno: string;
  estres: string;
  proteccionSolar: string;
  hidratacion: string;
  tipoPiel: string[];
  fototipo: string;
  condicionesPiel: string[];
  zonasInteres: string[];
  motivoConsulta: string[];
  procedimientoPropuesto: string;
  sesionesRecomendadas: string;
  observaciones: string;
}

export default function FacialAssessmentFormFinal() {
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: '',
    edad: '',
    sexo: '',
    telefono: '',
    correo: '',
    alergiaAnestesicos: false,
    alergiaMedicamentos: false,
    alergiaMedicamentosEspecificar: '',
    enfermedadesDermatologicas: false,
    procedimientosEsteticos: false,
    cicatrizacion: '',
    isotretinoina: false,
    tabaquismo: false,
    alcohol: false,
    sueno: '',
    estres: '',
    proteccionSolar: '',
    hidratacion: '',
    tipoPiel: [],
    fototipo: '',
    condicionesPiel: [],
    zonasInteres: [],
    motivoConsulta: [],
    procedimientoPropuesto: '',
    sesionesRecomendadas: '',
    observaciones: ''
  });

  const [photos, setPhotos] = useState<{
    frontal: string | null;
    lateralDerecho: string | null;
    lateralIzquierdo: string | null;
  }>({
    frontal: null,
    lateralDerecho: null,
    lateralIzquierdo: null
  });

  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const handlePhotoUpload = (type: 'frontal' | 'lateralDerecho' | 'lateralIzquierdo', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotos(prev => ({
        ...prev,
        [type]: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    signatureRef.current?.clear();
    setSignatureData(null);
  };

  const saveSignature = () => {
    if (signatureRef.current) {
      const signatureDataURL = signatureRef.current.toDataURL();
      setSignatureData(signatureDataURL);
    }
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.height;

      const checkPageBreak = (additionalHeight: number = lineHeight) => {
        if (yPosition + additionalHeight > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('FICHA DE VALORACION FACIAL (ENFOQUE ESTETICO)', 20, yPosition);
      yPosition += lineHeight * 2;

      // 1. Datos generales
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      checkPageBreak();
      doc.text('1. DATOS GENERALES DEL PACIENTE', 20, yPosition);
      yPosition += lineHeight;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      checkPageBreak();
      doc.text(`Nombre completo: ${formData.nombreCompleto}`, 20, yPosition);
      yPosition += lineHeight;
      checkPageBreak();
      doc.text(`Edad: ${formData.edad}`, 20, yPosition);
      yPosition += lineHeight;
      checkPageBreak();
      doc.text(`Sexo: ${formData.sexo}`, 20, yPosition);
      yPosition += lineHeight;
      checkPageBreak();
      doc.text(`Telefono/WhatsApp: ${formData.telefono}`, 20, yPosition);
      yPosition += lineHeight;
      checkPageBreak();
      doc.text(`Correo: ${formData.correo}`, 20, yPosition);
      yPosition += lineHeight * 2;

      // Agregar fotografías si existen
      if (photos.frontal || photos.lateralDerecho || photos.lateralIzquierdo) {
        doc.addPage();
        yPosition = 20;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('FOTOGRAFIAS', 20, yPosition);
        yPosition += lineHeight * 2;

        const imageWidth = 50;
        const imageHeight = 60;
        let xPosition = 20;

        if (photos.frontal) {
          doc.text('Frontal', xPosition, yPosition);
          try {
            doc.addImage(photos.frontal, 'JPEG', xPosition, yPosition + 5, imageWidth, imageHeight);
          } catch (e) {
            console.warn('Error adding frontal image:', e);
          }
          xPosition += imageWidth + 10;
        }

        if (photos.lateralDerecho) {
          doc.text('Lateral Derecho', xPosition, yPosition);
          try {
            doc.addImage(photos.lateralDerecho, 'JPEG', xPosition, yPosition + 5, imageWidth, imageHeight);
          } catch (e) {
            console.warn('Error adding lateral derecho image:', e);
          }
          xPosition += imageWidth + 10;
        }

        if (photos.lateralIzquierdo) {
          doc.text('Lateral Izquierdo', xPosition, yPosition);
          try {
            doc.addImage(photos.lateralIzquierdo, 'JPEG', xPosition, yPosition + 5, imageWidth, imageHeight);
          } catch (e) {
            console.warn('Error adding lateral izquierdo image:', e);
          }
        }

        yPosition += imageHeight + 20;
      }

      // Agregar firma si existe
      if (signatureData) {
        checkPageBreak(40);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('FIRMA DE AUTORIZACION', 20, yPosition);
        yPosition += lineHeight;
        try {
          doc.addImage(signatureData, 'PNG', 20, yPosition, 80, 30);
        } catch (e) {
          console.warn('Error adding signature:', e);
        }
      }

      doc.save('ficha_valoracion_facial.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ficha de Valoración Facial
        </h1>
        <p className="text-lg text-gray-600">(Enfoque Estético)</p>
      </div>

      {/* 1. Datos Generales */}
      <Card>
        <CardHeader>
          <CardTitle>1. Datos Generales del Paciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombreCompleto">Nombre completo</Label>
              <Input
                id="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                placeholder="Ingrese nombre completo"
              />
            </div>
            <div>
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                type="number"
                value={formData.edad}
                onChange={(e) => handleInputChange('edad', e.target.value)}
                placeholder="Ingrese edad"
              />
            </div>
          </div>
          
          <div>
            <Label>Sexo</Label>
            <RadioGroup
              value={formData.sexo}
              onValueChange={(value) => handleInputChange('sexo', value)}
              className="flex flex-row space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="femenino" id="femenino" />
                <Label htmlFor="femenino">Femenino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="masculino" id="masculino" />
                <Label htmlFor="masculino">Masculino</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="otro" id="otro" />
                <Label htmlFor="otro">Otro</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefono">Teléfono / WhatsApp</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                placeholder="Ingrese teléfono"
              />
            <div>
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                placeholder="Ingrese correo electrónico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Antecedentes Médicos */}
      <Card>
        <CardHeader>
          <CardTitle>2. Antecedentes Médicos Relevantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="alergiaAnestesicos"
                checked={formData.alergiaAnestesicos}
                onCheckedChange={(checked) => handleInputChange('alergiaAnestesicos', checked)}
              />
              <Label htmlFor="alergiaAnestesicos">Alergia a anestésicos tópicos</Label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alergiaMedicamentos"
                  checked={formData.alergiaMedicamentos}
                  onCheckedChange={(checked) => handleInputChange('alergiaMedicamentos', checked)}
                />
                <Label htmlFor="alergiaMedicamentos">Alergia a medicamentos</Label>
              </div>
              {formData.alergiaMedicamentos && (
                <Input
                  placeholder="Especificar medicamentos"
                  value={formData.alergiaMedicamentosEspecificar}
                  onChange={(e) => handleInputChange('alergiaMedicamentosEspecificar', e.target.value)}
                  className="ml-6"
                />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="enfermedadesDermatologicas"
                checked={formData.enfermedadesDermatologicas}
                onCheckedChange={(checked) => handleInputChange('enfermedadesDermatologicas', checked)}
              />
              <Label htmlFor="enfermedadesDermatologicas">
                Enfermedades dermatológicas (acné, psoriasis, rosácea, dermatitis, vitíligo)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="procedimientosEsteticos"
                checked={formData.procedimientosEsteticos}
                onCheckedChange={(checked) => handleInputChange('procedimientosEsteticos', checked)}
              />
              <Label htmlFor="procedimientosEsteticos">
                Procedimientos estéticos previos (rellenos, toxina, hilos, láser, peelings)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isotretinoina"
                checked={formData.isotretinoina}
                onCheckedChange={(checked) => handleInputChange('isotretinoina', checked)}
              />
              <Label htmlFor="isotretinoina">
                Uso de isotretinoína u otros tratamientos dermatológicos en últimos 6 meses
              </Label>
            </div>
          </div>

          <div>
            <Label>Cicatrización</Label>
            <RadioGroup
              value={formData.cicatrizacion}
              onValueChange={(value) => handleInputChange('cicatrizacion', value)}
              className="flex flex-row space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="cicatrizacion-normal" />
                <Label htmlFor="cicatrizacion-normal">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="queloide" id="cicatrizacion-queloide" />
                <Label htmlFor="cicatrizacion-queloide">Queloide</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hipertrofica" id="cicatrizacion-hipertrofica" />
                <Label htmlFor="cicatrizacion-hipertrofica">Hipertrófica</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 3. Hábitos y Estilo de Vida */}
      <Card>
        <CardHeader>
          <CardTitle>3. Hábitos y Estilo de Vida</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tabaquismo"
                checked={formData.tabaquismo}
                onCheckedChange={(checked) => handleInputChange('tabaquismo', checked)}
              />
              <Label htmlFor="tabaquismo">Tabaquismo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="alcohol"
                checked={formData.alcohol}
                onCheckedChange={(checked) => handleInputChange('alcohol', checked)}
              />
              <Label htmlFor="alcohol">Alcohol</Label>
            </div>
          </div>

          <div>
            <Label>Sueño</Label>
            <RadioGroup
              value={formData.sueno}
              onValueChange={(value) => handleInputChange('sueno', value)}
              className="flex flex-row space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4-6 hrs" id="sueno-4-6" />
                <Label htmlFor="sueno-4-6">4-6 hrs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6-8 hrs" id="sueno-6-8" />
                <Label htmlFor="sueno-6-8">6-8 hrs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value=">8 hrs" id="sueno-8plus" />
                <Label htmlFor="sueno-8plus">{'>'}8 hrs</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Estrés</Label>
            <RadioGroup
              value={formData.estres}
              onValueChange={(value) => handleInputChange('estres', value)}
              className="flex flex-row space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bajo" id="estres-bajo" />
                <Label htmlFor="estres-bajo">Bajo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderado" id="estres-moderado" />
                <Label htmlFor="estres-moderado">Moderado</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alto" id="estres-alto" />
                <Label htmlFor="estres-alto">Alto</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Protección solar</Label>
            <RadioGroup
              value={formData.proteccionSolar}
              onValueChange={(value) => handleInputChange('proteccionSolar', value)}
              className="flex flex-row space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nunca" id="proteccion-nunca" />
                <Label htmlFor="proteccion-nunca">Nunca</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ocasional" id="proteccion-ocasional" />
                <Label htmlFor="proteccion-ocasional">Ocasional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="diaria" id="proteccion-diaria" />
                <Label htmlFor="proteccion-diaria">Diaria</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Hidratación</Label>
            <RadioGroup
              value={formData.hidratacion}
              onValueChange={(value) => handleInputChange('hidratacion', value)}
              className="flex flex-row space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="<1L" id="hidratacion-1" />
                <Label htmlFor="hidratacion-1">{'<'}1L</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2L" id="hidratacion-2" />
                <Label htmlFor="hidratacion-2">1-2L</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value=">2L" id="hidratacion-3" />
                <Label htmlFor="hidratacion-3">{'>'}2L de agua al día</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* 4. Valoración Dermatológica */}
      <Card>
        <CardHeader>
          <CardTitle>4. Valoración Dermatológica y Estética Facial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de piel */}
          <div>
            <Label className="text-base font-semibold">Tipo de piel</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {['Grasa', 'Seca', 'Mixta', 'Sensible'].map((tipo) => (
                <div key={tipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-piel-${tipo.toLowerCase()}`}
                    checked={formData.tipoPiel.includes(tipo)}
                    onCheckedChange={(checked) => 
                      handleCheckboxArrayChange('tipoPiel', tipo, checked as boolean)
                    }
                  />
                  <Label htmlFor={`tipo-piel-${tipo.toLowerCase()}`}>{tipo}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Fototipo */}
          <div>
            <Label className="text-base font-semibold">Fototipo (Fitzpatrick)</Label>
            <RadioGroup
              value={formData.fototipo}
              onValueChange={(value) => handleInputChange('fototipo', value)}
              className="space-y-2 mt-2"
            >
              {[
                { value: 'I', label: 'I - Muy clara, siempre se quema, nunca se broncea' },
                { value: 'II', label: 'II - Clara, se quema fácilmente, se broncea mínimamente' },
                { value: 'III', label: 'III - Morena clara, se quema moderadamente, bronceo gradual' },
                { value: 'IV', label: 'IV - Morena moderada, se quema mínimamente, bronceo fácil' },
                { value: 'V', label: 'V - Morena oscura, rara vez se quema, bronceo intenso' },
                { value: 'VI', label: 'VI - Negra, nunca se quema' }
              ].map((fototipo) => (
                <div key={fototipo.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={fototipo.value} id={`fototipo-${fototipo.value}`} />
                  <Label htmlFor={`fototipo-${fototipo.value}`}>{fototipo.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Condiciones de la piel */}
          <div>
            <Label className="text-base font-semibold">Condiciones de la piel</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {[
                'Deshidratación',
                'Flacidez leve',
                'Flacidez moderada',
                'Flacidez severa',
                'Arrugas finas',
                'Arrugas profundas',
                'Manchas/melasma',
                'Acné activo',
                'Acné residual',
                'Cicatrices atróficas',
                'Cicatrices hipertróficas',
                'Rosácea/eritema difuso',
                'Poros dilatados',
                'Ojeras pigmentadas',
                'Ojeras vasculares',
                'Hundimiento'
              ].map((condicion) => (
                <div key={condicion} className="flex items-center space-x-2">
                  <Checkbox
                    id={`condicion-${condicion.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    checked={formData.condicionesPiel.includes(condicion)}
                    onCheckedChange={(checked) => 
                      handleCheckboxArrayChange('condicionesPiel', condicion, checked as boolean)
                    }
                  />
                  <Label htmlFor={`condicion-${condicion.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    {condicion}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Zonas de interés estético */}
          <div>
            <Label className="text-base font-semibold">Zonas de interés estético</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {[
                'Frente',
                'Entrecejo',
                'Párpados superiores',
                'Párpados inferiores/ojeras',
                'Pómulos',
                'Surcos nasogenianos',
                'Labios (volumen, hidratación, código de barras)',
                'Mentón',
                'Línea mandibular',
                'Cuello/papada'
              ].map((zona) => (
                <div key={zona} className="flex items-center space-x-2">
                  <Checkbox
                    id={`zona-${zona.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    checked={formData.zonasInteres.includes(zona)}
                    onCheckedChange={(checked) => 
                      handleCheckboxArrayChange('zonasInteres', zona, checked as boolean)
                    }
                  />
                  <Label htmlFor={`zona-${zona.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    {zona}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Motivo de Consulta */}
      <Card>
        <CardHeader>
          <CardTitle>5. Motivo de Consulta / Expectativas del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Rejuvenecimiento facial',
              'Mejorar flacidez',
              'Disminuir arrugas',
              'Redefinir contorno facial',
              'Mejorar textura y poros',
              'Unificar tono de piel',
              'Eliminar manchas',
              'Tratar acné o cicatrices',
              'Aumentar volumen en labios',
              'Mejorar ojeras',
              'Hidratación profunda'
            ].map((motivo) => (
              <div key={motivo} className="flex items-center space-x-2">
                <Checkbox
                  id={`motivo-${motivo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  checked={formData.motivoConsulta.includes(motivo)}
                  onCheckedChange={(checked) => 
                    handleCheckboxArrayChange('motivoConsulta', motivo, checked as boolean)
                  }
                />
                <Label htmlFor={`motivo-${motivo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                  {motivo}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Plan de Tratamiento */}
      <Card>
        <CardHeader>
          <CardTitle>6. Plan de Tratamiento Sugerido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="procedimientoPropuesto">Procedimiento propuesto</Label>
            <Input
              id="procedimientoPropuesto"
              value={formData.procedimientoPropuesto}
              onChange={(e) => handleInputChange('procedimientoPropuesto', e.target.value)}
              placeholder="Ingrese el procedimiento propuesto"
            />
          </div>

          <div>
            <Label htmlFor="sesionesRecomendadas">Sesiones recomendadas</Label>
            <Input
              id="sesionesRecomendadas"
              type="number"
              value={formData.sesionesRecomendadas}
              onChange={(e) => handleInputChange('sesionesRecomendadas', e.target.value)}
              placeholder="Número de sesiones"
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Ingrese observaciones adicionales"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fotografías */}
      <Card>
        <CardHeader>
          <CardTitle>Fotografías del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Foto Frontal */}
              <div className="text-center">
                <Label className="block mb-2 font-semibold">Fotografía Frontal</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center">
                  {photos.frontal ? (
                    <img
                      src={photos.frontal}
                      alt="Fotografía frontal"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/787f099a-ef5e-49bb-884b-b05be94c4128.png";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Sin imagen</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload('frontal', file);
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                {photos.frontal && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setPhotos(prev => ({ ...prev, frontal: null }))}
                  >
                    Eliminar
                  </Button>
                )}
              </div>

              {/* Foto Lateral Derecho */}
              <div className="text-center">
                <Label className="block mb-2 font-semibold">Lateral Derecho</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center">
                  {photos.lateralDerecho ? (
                    <img
                      src={photos.lateralDerecho}
                      alt="Fotografía lateral derecho"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/787f099a-ef5e-49bb-884b-b05be94c4128.png";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Sin imagen</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload('lateralDerecho', file);
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                {photos.lateralDerecho && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setPhotos(prev => ({ ...prev, lateralDerecho: null }))}
                  >
                    Eliminar
                  </Button>
                )}
              </div>

              {/* Foto Lateral Izquierdo */}
              <div className="text-center">
                <Label className="block mb-2 font-semibold">Lateral Izquierdo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex items-center justify-center">
                  {photos.lateralIzquierdo ? (
                    <img
                      src={photos.lateralIzquierdo}
                      alt="Fotografía lateral izquierdo"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/787f099a-ef5e-49bb-884b-b05be94c4128.png";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 mb-2">Sin imagen</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload('lateralIzquierdo', file);
                        }}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                {photos.lateralIzquierdo && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setPhotos(prev => ({ ...prev, lateralIzquierdo: null }))}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Firma de Autorización */}
      <Card>
        <CardHeader>
          <CardTitle>Firma de Autorización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: 500,
                  height: 200,
                  className: 'signature-canvas border rounded'
                }}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={clearSignature}
              >
                Limpiar Firma
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={saveSignature}
              >
                Guardar Firma
              </Button>
            </div>
            {signatureData && (
              <div className="mt-4">
                <p className="text-sm text-green-600 mb-2">Firma guardada correctamente</p>
                <img
                  src={signatureData}
                  alt="Firma guardada"
                  className="border rounded max-w-xs"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botón para generar PDF */}
      <div className="text-center">
        <Button
          onClick={generatePDF}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
        >
          Generar PDF
        </Button>
      </div>
    </div>
  );
}
