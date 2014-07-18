package com.xiaomi.mif2e.fontSubsetter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.google.typography.font.sfntly.Font;
import com.google.typography.font.sfntly.FontFactory;
import com.google.typography.font.sfntly.Tag;
import com.google.typography.font.sfntly.data.WritableFontData;
import com.google.typography.font.sfntly.table.core.CMapTable;
import com.google.typography.font.tools.conversion.eot.EOTWriter;
import com.google.typography.font.tools.conversion.woff.WoffWriter;
import com.google.typography.font.tools.sfnttool.GlyphCoverage;
import com.google.typography.font.tools.subsetter.RenumberingSubsetter;
import com.google.typography.font.tools.subsetter.Subsetter;

public class Util {

	public static enum FileType {
		TTF, WOFF, EOT
	}

	public static Font subset(File fontFile, String subsetString)
			throws IOException {

		FontFactory fontFactory = FontFactory.getInstance();
		FileInputStream fis = new FileInputStream(fontFile);

		byte[] fontBytes = new byte[(int) fontFile.length()];
		fis.read(fontBytes);

		Font[] fontArray = null;
		fontArray = fontFactory.loadFonts(fontBytes);

		Font font = fontArray[0];
		List<CMapTable.CMapId> cmapIds = new ArrayList<CMapTable.CMapId>();
		cmapIds.add(CMapTable.CMapId.WINDOWS_BMP);

		Font newFont = font;

		Subsetter subsetter = new RenumberingSubsetter(newFont, fontFactory);
		subsetter.setCMaps(cmapIds, 1);
		List<Integer> glyphs = GlyphCoverage.getGlyphCoverage(font,
				subsetString);
		subsetter.setGlyphs(glyphs);
		Set<Integer> removeTables = new HashSet<Integer>();
		// Most of the following are valid tables, but we don't renumber them
		// yet, so strip
		removeTables.add(Tag.GDEF);
		removeTables.add(Tag.GPOS);
		removeTables.add(Tag.GSUB);
		removeTables.add(Tag.kern);
		removeTables.add(Tag.hdmx);
		removeTables.add(Tag.vmtx);
		removeTables.add(Tag.VDMX);
		removeTables.add(Tag.LTSH);
		removeTables.add(Tag.DSIG);
		// AAT tables, not yet defined in sfntly Tag class
		removeTables.add(Tag.intValue(new byte[] { 'm', 'o', 'r', 't' }));
		removeTables.add(Tag.intValue(new byte[] { 'm', 'o', 'r', 'x' }));
		subsetter.setRemoveTables(removeTables);
		newFont = subsetter.subset().build();

		fis.close();

		return newFont;
	}

	public static void saveAsTtf(File outputFile, Font font) throws IOException {
		FileOutputStream fos = new FileOutputStream(outputFile);
		FontFactory ff = FontFactory.getInstance();
		ff.serializeFont(font, fos);
		fos.close();
	}

	public static void saveAsWoff(File outputFile, Font font)
			throws IOException {
		FileOutputStream fos = new FileOutputStream(outputFile);
		WritableFontData woffData = new WoffWriter().convert(font);
		woffData.copyTo(fos);
		fos.close();
	}

	public static void saveAsEot(File outputFile, Font font, boolean mtx)
			throws IOException {
		FileOutputStream fos = new FileOutputStream(outputFile);
		WritableFontData eotData = new EOTWriter(mtx).convert(font);
		eotData.copyTo(fos);
		fos.close();
	}

}
