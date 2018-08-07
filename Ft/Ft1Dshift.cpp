	//********************************************************************************************************
	// 8 bit images
	//********************************************************************************************************
		if(bitDepth == 8)
		{
			//****************************************************
			// 8 bit Forward
			//****************************************************
			if(Forward == true)
			{
				iAmpMx = 255;
				dAmpMx = (double)iAmpMx;
				dAmpMxD2 = dAmpMx / (double)2.0;
				dLG = log10(dAmpMx * dxSize) / dAmpMx;
			/*
			3D
				indx = x + y * xmx + z * xmx * ymx
						= x + (y + z * ymx) * xmx
				x = indx % xmx
				y = (indx / xmx) % ymx
				z = indx / (xmx * ymx)

			2D
				indx = x + y * xmx
				x = indx % xmx
				y = (indx / xmx) % ymx
			*/
				for(k = 0; k < zSize; k++)
				{
					for(j = 0; j < ySize; j++)
					{
						for(i = 0; i < xSize; i++)
						{
							dSum = (double)cIn[iRC * j + nPlanes * i + k];

							inD[xSize * j + i] = dSum;
						}
						//****************************************************
						// 8 bit Forward   compute forward transform
						//****************************************************
						p = fftw_plan_dft_r2c_1d(xSize, &inD[xSize * j], &complex_in[xSizeH * j], FFTW_ESTIMATE);
						fftw_execute(p);
						fftw_destroy_plan(p);
						//****************************************************
						// 8 bit Forward    compute Spectra
						//****************************************************
						for(i = 0; i < xSizeH; i++)
						{
							dAmp = 0.0;
							dPhz = 0.0;
							dRe = (double)c_re(complex_in[xSizeH * j + i]);
							dIm = (double)c_im(complex_in[xSizeH * j + i]);
							dAmp = (double)sqrt(dRe * dRe + dIm * dIm);
							if(dAmp > 0.0)
							{
								dAmp = (double)log10(dAmp) / dLG;
								dPhz = (double)atan2(dIm, dRe) * Rad2Deg * (dAmpMx / degMax) + dAmpMxD2;
							}
							dRnd = dAmp + 0.5;
							if(dRnd < 0.0) dRnd = 0.0;
							if(dRnd > dAmpMx) dRnd = dAmpMx;
							cOut[oRC * j + nPlanes * i + k] = (unsigned char)dRnd;

							dRnd = dPhz + 0.5;
							if(dRnd < 0.0) dRnd = 0.0;
							if(dRnd > dAmpMx) dRnd = dAmpMx;
							cOut[oRC * j + nPlanes * (i + xSizeH) + k] = (unsigned char)dRnd;
						}
					}
				}
			}
		}
		//****************************************************
		// 8 bit Inverse
		//****************************************************
		if(Inverse == true)
		{
			iAmpMx = 255;
			dAmpMx = (double)iAmpMx;
			dAmpMxD2 = dAmpMx / (double)2.0;
			dLG = log10(dAmpMx * dxSize) / dAmpMx;
			for(k = 0; k < zSize; k++)
			{
				for(j = 0; j < ySize; j++)
				{
					for(i = 0; i < xSize; i++)
					{
						dRe = (double)cIn[iRC * j + nPlanes * i + k];
						if(dRe > 0.0)
						{
							dIm = (double)cIn[iRC * j + nPlanes * (i + xSizeH) + k];

							dAmp = (double)pow(10, dRe * dLG);
							dPhz = (dIm - dAmpMxD2) / (Rad2Deg * (dAmpMx / degMax));

							dRe = dAmp * cos(dPhz);
							dIm = dAmp * sin(dPhz);
						}
						c_re(complex_in[xSize * j + i]) = (float)dRe;
						c_im(complex_in[xSize * j + i]) = (float)dIm;
					}
					//****************************************************
					// 8 bit Inverse    compute inverse transform
					//****************************************************
					p = fftw_plan_dft_c2r_1d(xSize, &complex_in[xSize * j], &inD[xSize * j], FFTW_ESTIMATE);
					fftw_execute(p);
					fftw_destroy_plan(p);
					//****************************************************
					// 8 bit Inverse    compute illumination from SpectrA
					//****************************************************
					for(i = 0; i < xSize; i++)
					{
						dRe = inD[xSize * j + i] / dxSize;
						dRnd = dRe + 0.5;
						if(dRnd < 0.0) dRnd = 0.0;
						if(dRnd > dAmpMx) dRnd = dAmpMx;
						cOut[oRC * j + nPlanes * i + k] = (unsigned char)dRnd;
					}
				}
			}
		}
